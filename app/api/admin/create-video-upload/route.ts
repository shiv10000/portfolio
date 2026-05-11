import {categories} from '@/data/categories';
import {ADMIN_COOKIE_NAME, isValidAdminToken} from '@/lib/admin-auth';
import {createAwsVideoUploadTicket, hasAwsStorageConfig} from '@/lib/aws-storage';
import {hasSupabaseConfig} from '@/lib/supabase-server';
import {cookies} from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_VIDEO_BYTES = 250 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
]);

type UploadRequestBody = {
  fileName?: string;
  contentType?: string;
  fileSize?: number;
  title?: string;
  category?: string;
  description?: string;
};

function validateBody(body: UploadRequestBody) {
  const fileName = String(body.fileName ?? '').trim();
  const contentType = String(body.contentType ?? '').trim();
  const title = String(body.title ?? '').trim();
  const category = String(body.category ?? '').trim();
  const description = String(body.description ?? '').trim();
  const fileSize = Number(body.fileSize ?? 0);

  if (!fileName || !title || !category || !description) {
    return 'File name, title, category, and description are required';
  }

  if (!categories.some((item) => item.name === category)) {
    return 'Invalid category';
  }

  if (!ALLOWED_VIDEO_TYPES.has(contentType)) {
    return 'Please upload an MP4, WebM, MOV, or M4V video file';
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return 'Video file size is missing';
  }

  if (fileSize > MAX_VIDEO_BYTES) {
    return 'Video is too large. Keep uploads under 250MB.';
  }

  return null;
}

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

  const body = (await request.json().catch(() => ({}))) as UploadRequestBody;
  const validationError = validateBody(body);

  if (validationError) {
    return Response.json({message: validationError}, {status: 400});
  }

  const upload = await createAwsVideoUploadTicket({
    fileName: String(body.fileName),
    contentType: String(body.contentType),
  });

  return Response.json(upload);
}
