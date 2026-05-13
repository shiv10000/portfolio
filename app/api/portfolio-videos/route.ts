import {getSupabaseAdmin, hasSupabaseConfig} from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasSupabaseConfig()) {
    return Response.json(
      {message: 'Supabase environment variables are missing on the server', videos: []},
      {status: 500},
    );
  }

  const supabase = getSupabaseAdmin();
  const {data, error} = await supabase
    .from('portfolio_videos')
    .select(
      'id,title,category,description,video_url,storage_provider,s3_object_key,s3_bucket,bytes,published,featured_rank,created_at',
    )
    .eq('published', true)
    .order('featured_rank', {ascending: true, nullsFirst: false})
    .order('created_at', {ascending: false});

  if (error) {
    return Response.json({message: error.message, videos: []}, {status: 500});
  }

  return Response.json({videos: data ?? []});
}
