import {categories} from '@/data/categories';
import {ADMIN_COOKIE_NAME, isValidAdminToken} from '@/lib/admin-auth';
import {
  assertAwsObjectExists,
  getAwsBucket,
  getPublicVideoUrl,
  hasAwsStorageConfig,
} from '@/lib/aws-storage';
import {getSupabaseAdmin, hasSupabaseConfig} from '@/lib/supabase-server';
import {cookies} from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CompleteUploadBody = {
  title?: string;
  category?: string;
  description?: string;
  objectKey?: string;
  fileSize?: number;
  published?: boolean;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminToken(adminToken)) {
    return Response.json({message: 'Unauthorized'}, {status: 401});
  }

  if (!hasAwsStorageConfig()) {
    return Response.json(
      {message: 'AWS S3 and CloudFront env vars are missing'},
      {status: 500},
    );
  }

  if (!hasSupabaseConfig()) {
    return Response.json(
      {message: 'Supabase env vars are missing'},
      {status: 500},
    );
  }

  const body = (await request.json().catch(() => ({}))) as CompleteUploadBody;
  const title = String(body.title ?? '').trim();
  const category = String(body.category ?? '').trim();
  const description = String(body.description ?? '').trim();
  const objectKey = String(body.objectKey ?? '').trim();
  const bytes = Number(body.fileSize ?? 0);

  if (!title || !category || !description || !objectKey) {
    return Response.json(
      {message: 'Title, category, description, and S3 object key are required'},
      {status: 400},
    );
  }

  if (!categories.some((item) => item.name === category)) {
    return Response.json({message: 'Invalid category'}, {status: 400});
  }

  try {
    await assertAwsObjectExists(objectKey);
  } catch (error) {
    console.error('S3 upload verification failed', error);
    return Response.json(
      {
        message:
          'Upload reached AWS, but the server could not verify it. Check that the IAM policy includes s3:GetObject for the portfolio-videos/* prefix.',
      },
      {status: 400},
    );
  }

  const supabase = getSupabaseAdmin();
  const {data, error} = await supabase
    .from('portfolio_videos')
    .insert({
      title,
      category,
      description,
      video_url: getPublicVideoUrl(objectKey),
      storage_provider: 'aws_s3',
      s3_object_key: objectKey,
      s3_bucket: getAwsBucket(),
      bytes: Number.isFinite(bytes) && bytes > 0 ? bytes : null,
      published: body.published !== false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({message: error.message}, {status: 500});
  }

  return Response.json({video: data});
}
