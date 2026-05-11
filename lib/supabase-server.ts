import {createClient} from '@supabase/supabase-js';

export type PortfolioVideoRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string;
  storage_provider: 'aws_s3';
  s3_object_key: string;
  s3_bucket: string;
  bytes: number | null;
  published: boolean;
  created_at: string;
};

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server env vars are missing');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
