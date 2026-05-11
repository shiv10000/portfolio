# AWS + Supabase Portfolio Video Setup

This project has two surfaces in one Next.js app:

- `/admin` uploads and publishes videos.
- `/` fetches published videos from Supabase and displays them in the portfolio.

The secure upload flow is:

1. Admin logs in.
2. Admin selects a video and enters title, category, and description.
3. The app asks the backend for a short-lived S3 upload URL.
4. The browser uploads the file directly to S3.
5. The backend verifies the S3 object exists.
6. The backend saves title, category, description, CloudFront URL, and S3 key to Supabase.
7. The portfolio fetches Supabase and shows the new video after refresh.

## 1. Create AWS S3 Bucket

Create a bucket such as:

```text
shivam-portfolio-videos
```

Recommended region for India:

```text
ap-south-1
```

Keep the bucket private:

- Enable S3 Block Public Access.
- Do not add public-read ACLs.
- Do not make the bucket website-hosting public.

## 2. Add S3 CORS

In the S3 bucket CORS settings, add:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Replace `https://your-production-domain.com` with your real website domain.

## 3. Create CloudFront Distribution

Create a CloudFront distribution with:

- Origin: your private S3 bucket
- Access: Origin Access Control
- Viewer protocol policy: Redirect HTTP to HTTPS

Then update the S3 bucket policy using the policy CloudFront gives you.

Your final playback domain will look like:

```text
https://dxxxxxxxxxxxxx.cloudfront.net
```

## 4. Create Minimal IAM Policy

Create an IAM user or role for this app. Give it access only to this bucket.

Replace `shivam-portfolio-videos` with your bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::shivam-portfolio-videos/portfolio-videos/*"
    }
  ]
}
```

Create an access key for that IAM identity.

## 5. Add Environment Variables

Create `.env.local` in this project:

```env
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=make-this-a-long-random-secret

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

S3_REGION=ap-south-1
S3_ACCESS_KEY_ID=your-aws-access-key-id
S3_SECRET_ACCESS_KEY=your-aws-secret-access-key
S3_BUCKET=shivam-portfolio-videos
CLOUDFRONT_DOMAIN=https://dxxxxxxxxxxxxx.cloudfront.net
```

Never put `S3_SECRET_ACCESS_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

## 6. Run Supabase SQL

Open Supabase SQL Editor and run:

```sql
create extension if not exists pgcrypto;

create table if not exists public.portfolio_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  video_url text not null,
  storage_provider text not null default 'aws_s3',
  s3_object_key text,
  s3_bucket text,
  bytes bigint,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.portfolio_videos
add column if not exists storage_provider text not null default 'aws_s3';

alter table public.portfolio_videos
add column if not exists s3_object_key text;

alter table public.portfolio_videos
add column if not exists s3_bucket text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_videos'
      and column_name = 'azure_blob_name'
  ) then
    alter table public.portfolio_videos alter column azure_blob_name drop not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_videos'
      and column_name = 'azure_container'
  ) then
    alter table public.portfolio_videos alter column azure_container drop not null;
  end if;
end $$;

alter table public.portfolio_videos enable row level security;

drop policy if exists "Published videos are public" on public.portfolio_videos;

create policy "Published videos are public"
on public.portfolio_videos
for select
using (published = true);

create index if not exists portfolio_videos_published_created_at_idx
on public.portfolio_videos (published, created_at desc);
```

## 7. Test

Run:

```bash
npm run dev -- --port 3000
```

Then:

- Open `http://localhost:3000/admin`
- Login with `ADMIN_PASSWORD`
- Upload a video
- Open `http://localhost:3000/#work`
- Refresh and check that the video appears

## Safety Checklist

- Keep S3 private.
- Use CloudFront Origin Access Control.
- Keep AWS keys server-side only.
- Use IAM least privilege for one bucket prefix.
- Set AWS Budget alerts.
- Compress videos before upload.
- Keep portfolio uploads under 250MB.
