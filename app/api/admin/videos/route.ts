import {ADMIN_COOKIE_NAME, isValidAdminToken} from '@/lib/admin-auth';
import {deleteAwsObject, hasAwsStorageConfig} from '@/lib/aws-storage';
import {getSupabaseAdmin, hasSupabaseConfig} from '@/lib/supabase-server';
import {cookies} from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return Response.json({message: 'Unauthorized'}, {status: 401});
}

async function isAuthorizedAdmin() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return isValidAdminToken(adminToken);
}

export async function GET() {
  if (!(await isAuthorizedAdmin())) {
    return unauthorized();
  }

  if (!hasSupabaseConfig()) {
    return Response.json(
      {message: 'Supabase env vars are missing', videos: []},
      {status: 500},
    );
  }

  const supabase = getSupabaseAdmin();
  const {data, error} = await supabase
    .from('portfolio_videos')
    .select(
      'id,title,category,description,video_url,storage_provider,s3_object_key,s3_bucket,bytes,published,created_at',
    )
    .order('created_at', {ascending: false});

  if (error) {
    return Response.json({message: error.message, videos: []}, {status: 500});
  }

  return Response.json({videos: data ?? []});
}

export async function DELETE(request: Request) {
  if (!(await isAuthorizedAdmin())) {
    return unauthorized();
  }

  if (!hasSupabaseConfig()) {
    return Response.json(
      {message: 'Supabase env vars are missing'},
      {status: 500},
    );
  }

  if (!hasAwsStorageConfig()) {
    return Response.json(
      {message: 'AWS S3 and CloudFront env vars are missing'},
      {status: 500},
    );
  }

  const body = (await request.json().catch(() => ({}))) as {id?: string};
  const id = String(body.id ?? '').trim();

  if (!id) {
    return Response.json({message: 'Video id is required'}, {status: 400});
  }

  const supabase = getSupabaseAdmin();
  const {data: video, error: readError} = await supabase
    .from('portfolio_videos')
    .select('id,s3_object_key')
    .eq('id', id)
    .single();

  if (readError || !video) {
    return Response.json({message: 'Video was not found'}, {status: 404});
  }

  if (video.s3_object_key) {
    try {
      await deleteAwsObject(video.s3_object_key);
    } catch (error) {
      console.error('S3 video delete failed', error);
      return Response.json(
        {
          message:
            'Could not delete the AWS video file. Check that IAM includes s3:DeleteObject for portfolio-videos/*.',
        },
        {status: 500},
      );
    }
  }

  const {error: deleteError} = await supabase
    .from('portfolio_videos')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return Response.json({message: deleteError.message}, {status: 500});
  }

  return Response.json({ok: true});
}
