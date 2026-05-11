'use client';

import {categories} from '@/data/categories';
import {
  ExternalLink,
  LogOut,
  RefreshCw,
  Trash2,
  UploadCloud,
  Video,
} from 'lucide-react';
import {FormEvent, useCallback, useEffect, useRef, useState} from 'react';

type UploadStatus =
  | {type: 'idle'; message: string}
  | {type: 'loading'; message: string}
  | {type: 'success'; message: string}
  | {type: 'error'; message: string};

type AdminPanel = 'upload' | 'manage';

type AdminVideo = {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string;
  s3_object_key: string | null;
  bytes: number | null;
  published: boolean;
  created_at: string;
};

function formatBytes(bytes: number | null) {
  if (!bytes) return 'Size unknown';

  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;

  return `${(mb / 1024).toFixed(2)} GB`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function AdminUploadPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [adminVideos, setAdminVideos] = useState<AdminVideo[]>([]);
  const [activePanel, setActivePanel] = useState<AdminPanel>('upload');
  const [videosLoading, setVideosLoading] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>({
    type: 'idle',
    message: 'Login to upload portfolio videos.',
  });

  const loadAdminVideos = useCallback(async (silent = false) => {
    if (!silent) {
      setVideosLoading(true);
    }

    try {
      const response = await fetch('/api/admin/videos', {cache: 'no-store'});
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        videos?: AdminVideo[];
      };

      if (response.status === 401) {
        setIsLoggedIn(false);
        setAdminVideos([]);
        return;
      }

      if (!response.ok) {
        if (!silent) {
          setStatus({
            type: 'error',
            message: data.message ?? 'Could not load uploaded videos.',
          });
        }
        return;
      }

      setIsLoggedIn(true);
      setAdminVideos(data.videos ?? []);
    } finally {
      if (!silent) {
        setVideosLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadAdminVideos(true);
  }, [loadAdminVideos]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({type: 'loading', message: 'Checking admin password...'});

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password}),
    });

    if (!response.ok) {
      setStatus({type: 'error', message: 'Wrong admin password.'});
      return;
    }

    setIsLoggedIn(true);
    setActivePanel('upload');
    setPassword('');
    await loadAdminVideos(true);
    setStatus({type: 'idle', message: 'Select a video and publish it.'});
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {method: 'POST'});
    setIsLoggedIn(false);
    setActivePanel('upload');
    setAdminVideos([]);
    setStatus({type: 'idle', message: 'Logged out.'});
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('file');
    const title = String(formData.get('title') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const published = formData.get('published') === 'true';

    if (!(file instanceof File)) {
      setStatus({type: 'error', message: 'Please select a video file.'});
      return;
    }

    const uploadPayload = {
      fileName: file.name,
      contentType: file.type || 'video/mp4',
      fileSize: file.size,
      title,
      category,
      description,
      published,
    };

    setStatus({
      type: 'loading',
      message: 'Creating a secure AWS upload link...',
    });

    const ticketResponse = await fetch('/api/admin/create-video-upload', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(uploadPayload),
    });

    const ticket = (await ticketResponse.json().catch(() => ({}))) as {
      message?: string;
      uploadUrl?: string;
      objectKey?: string;
    };

    if (!ticketResponse.ok || !ticket.uploadUrl || !ticket.objectKey) {
      setStatus({
        type: 'error',
        message: ticket.message ?? 'Could not create AWS upload link.',
      });
      return;
    }

    setStatus({
      type: 'loading',
      message: 'Uploading video directly to AWS S3...',
    });

    const uploadResponse = await fetch(ticket.uploadUrl, {
      method: 'PUT',
      headers: {'Content-Type': uploadPayload.contentType},
      body: file,
    });

    if (!uploadResponse.ok) {
      setStatus({
        type: 'error',
        message:
          'AWS upload failed. Check S3 CORS, bucket permissions, and your video size.',
      });
      return;
    }

    setStatus({
      type: 'loading',
      message: 'Saving video details to Supabase...',
    });

    const completeResponse = await fetch('/api/admin/complete-video-upload', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...uploadPayload,
        objectKey: ticket.objectKey,
      }),
    });

    const completeData = (await completeResponse.json().catch(() => ({}))) as {
      message?: string;
    };

    if (!completeResponse.ok) {
      setStatus({
        type: 'error',
        message:
          completeData.message ??
          'Video uploaded to AWS, but Supabase save failed.',
      });
      return;
    }

    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    await loadAdminVideos(true);
    setActivePanel('manage');

    setStatus({
      type: 'success',
      message: 'Video uploaded, saved, and published to the portfolio.',
    });
  };

  const handleDeleteVideo = async (video: AdminVideo) => {
    const shouldDelete = window.confirm(
      `Delete "${video.title}" from AWS and the portfolio?`,
    );

    if (!shouldDelete) return;

    setDeletingVideoId(video.id);
    setStatus({
      type: 'loading',
      message: `Deleting "${video.title}" from AWS and Supabase...`,
    });

    const response = await fetch('/api/admin/videos', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: video.id}),
    });
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
    };

    setDeletingVideoId(null);

    if (!response.ok) {
      setStatus({
        type: 'error',
        message: data.message ?? 'Video delete failed.',
      });
      return;
    }

    setAdminVideos((currentVideos) =>
      currentVideos.filter((currentVideo) => currentVideo.id !== video.id),
    );
    setStatus({
      type: 'success',
      message: `"${video.title}" was deleted from the portfolio.`,
    });
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div>
              <p className="section-kicker">Admin Dashboard</p>
              <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
                Portfolio Video Manager
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                Upload a video once. It goes straight to AWS S3, metadata is saved in
                Supabase, and the main portfolio fetches it automatically.
              </p>
            </div>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-black text-white/70 transition hover:bg-white hover:text-black"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            ) : null}
          </div>

          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="mt-8 max-w-md space-y-4">
              <label className="block">
                <span className="text-sm font-black text-white/70">
                  Admin Password
                </span>
                <input
                  type="password"
                  value={password ?? ''}
                  onChange={(event) => setPassword(event.currentTarget.value ?? '')}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-[#66e8ff]/60"
                  placeholder="Enter admin password"
                  required
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-[#66e8ff]"
              >
                Login
              </button>
            </form>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
              <aside className="rounded-3xl border border-white/10 bg-black/24 p-3">
                <button
                  type="button"
                  onClick={() => setActivePanel('upload')}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-black transition ${
                    activePanel === 'upload'
                      ? 'bg-white text-black'
                      : 'text-white/62 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <UploadCloud className="h-5 w-5" aria-hidden="true" />
                  Upload Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePanel('manage');
                    void loadAdminVideos(true);
                  }}
                  className={`mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-black transition ${
                    activePanel === 'manage'
                      ? 'bg-white text-black'
                      : 'text-white/62 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Video className="h-5 w-5" aria-hidden="true" />
                  Manage Videos
                </button>
              </aside>

              <div>
                {activePanel === 'upload' ? (
                  <form onSubmit={handleUpload} className="grid gap-5">
                    <label className="block rounded-3xl border border-dashed border-white/18 bg-black/24 p-5">
                      <span className="flex items-center gap-3 text-sm font-black uppercase text-white/70">
                        <UploadCloud className="h-5 w-5 text-[#66e8ff]" aria-hidden="true" />
                        Select Video File
                      </span>
                      <input
                        ref={fileInputRef}
                        name="file"
                        type="file"
                        accept="video/*"
                        className="mt-4 w-full cursor-pointer rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-black file:text-black"
                        required
                      />
                    </label>

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-black text-white/70">
                          Title
                        </span>
                        <input
                          name="title"
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-[#66e8ff]/60"
                          placeholder="AI tool reel"
                          required
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-black text-white/70">
                          Category
                        </span>
                        <select
                          name="category"
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-[#66e8ff]/60"
                          required
                        >
                          {categories.map((category) => (
                            <option key={category.name} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-sm font-black text-white/70">
                        Description
                      </span>
                      <textarea
                        name="description"
                        rows={5}
                        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-[#66e8ff]/60"
                        placeholder="Fast-paced reel with captions, motion graphics, and clean transitions."
                        required
                      />
                    </label>

                    <label className="flex items-center gap-3 text-sm font-bold text-white/68">
                      <input
                        name="published"
                        type="checkbox"
                        value="true"
                        defaultChecked
                        className="h-5 w-5 accent-[#66e8ff]"
                      />
                      Publish immediately
                    </label>

                    <button
                      type="submit"
                      disabled={status.type === 'loading'}
                      className="w-fit rounded-full bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-[#66e8ff] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {status.type === 'loading' ? 'Uploading...' : 'Upload Video'}
                    </button>
                  </form>
                ) : (
                  <section className="rounded-3xl border border-white/10 bg-black/24 p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="section-kicker">Manage Videos</p>
                        <h2 className="mt-2 text-2xl font-black text-white">
                          Uploaded portfolio videos
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-white/52">
                          Review titles, categories, descriptions, publish status, and remove videos from AWS and Supabase.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void loadAdminVideos()}
                        disabled={videosLoading}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-black text-white/70 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${videosLoading ? 'animate-spin' : ''}`}
                          aria-hidden="true"
                        />
                        Refresh
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4">
                      {videosLoading ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm font-bold text-white/52">
                          Loading uploaded videos...
                        </div>
                      ) : null}

                      {!videosLoading && adminVideos.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/14 bg-white/[0.025] p-6 text-sm font-bold text-white/48">
                          No videos uploaded yet. Upload one from the sidebar and it will appear here.
                        </div>
                      ) : null}

                      {adminVideos.map((video) => (
                        <article
                          key={video.id}
                          className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[120px_1fr_auto]"
                        >
                          <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-black">
                            <video
                              src={video.video_url}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-[#66e8ff]/20 bg-[#66e8ff]/10 px-3 py-1 text-xs font-black uppercase text-[#9df3ff]">
                                {video.category}
                              </span>
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${
                                  video.published
                                    ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
                                    : 'border-white/10 bg-white/5 text-white/48'
                                }`}
                              >
                                {video.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <h3 className="mt-3 truncate text-xl font-black text-white">
                              {video.title}
                            </h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/58">
                              {video.description}
                            </p>
                            <p className="mt-3 text-xs font-bold uppercase text-white/36">
                              {formatDate(video.created_at)} / {formatBytes(video.bytes)}
                            </p>
                          </div>

                          <div className="flex items-start gap-2 md:flex-col">
                            <a
                              href={video.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition hover:bg-white hover:text-black"
                              aria-label={`Open ${video.title}`}
                            >
                              <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            </a>
                            <button
                              type="button"
                              onClick={() => void handleDeleteVideo(video)}
                              disabled={deletingVideoId === video.id}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
                              aria-label={`Delete ${video.title}`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}

          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-bold ${
              status.type === 'error'
                ? 'border-red-400/30 bg-red-500/10 text-red-200'
                : status.type === 'success'
                  ? 'border-[#66e8ff]/30 bg-[#66e8ff]/10 text-[#c9f7ff]'
                  : 'border-white/10 bg-black/24 text-white/52'
            }`}
          >
            {status.message}
          </div>
        </div>
      </div>
    </main>
  );
}
