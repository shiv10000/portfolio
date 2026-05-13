'use client';

import {portfolioFilters, type PortfolioFilter} from '@/data/portfolio';
import {AnimatePresence, motion} from 'framer-motion';
import {ExternalLink, Volume2, VolumeX} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

type CloudPortfolioVideo = {
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
  featured_rank: number | null;
  created_at: string;
};

type UploadedPortfolioItem = {
  type: 'uploaded';
  id: string;
  title: string;
  category: string;
  filterCategory: Exclude<PortfolioFilter, 'All'>;
  videoUrl: string;
  description: string;
};

const categoryToFilter: Record<string, Exclude<PortfolioFilter, 'All'>> = {
  Tech: 'Tech',
  'Tech Videos': 'Tech',
  'YouTube Videos': 'Tech',
  Cinematic: 'Cinematic',
  'Cinematic Video Edits': 'Cinematic',
  'Entertainment Videos': 'Cinematic',
  'Event Highlight Videos': 'Cinematic',
  'AI Videos': 'AI Videos',
  'AI-Generated Videos': 'AI Videos',
  'Motion Graphics': 'AI Videos',
  'Brand Videos': 'Brand Videos',
  'Brand Ads': 'Brand Videos',
  Advertisement: 'Advertisement',
  'Product Promo Videos': 'Advertisement',
  'Reels & Shorts': 'Advertisement',
  'Podcast Clips': 'Advertisement',
  'Instagram Content': 'Advertisement',
  'Caption-Heavy Reels': 'Advertisement',
  'Vlog & Lifestyle Edits': 'Advertisement',
};

function UploadedPortfolioCard({item}: {item: UploadedPortfolioItem}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMuted = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        void videoRef.current.play();
      }
    }
  };

  return (
    <motion.article
      layout
      key={item.id}
      initial={{opacity: 0, y: 28}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, scale: 0.96}}
      transition={{duration: 0.28}}
      className="group shrink-0 basis-[82vw] snap-start overflow-hidden rounded-lg premium-border sm:basis-[58vw] md:basis-auto"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={item.videoUrl}
          className="h-full w-full bg-black object-contain"
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="metadata"
        />
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:scale-105 hover:bg-black/78"
        >
          {muted ? (
            <VolumeX className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <a
          href={item.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black"
          aria-label={`Open ${item.title}`}
        >
          <ExternalLink size={16} />
        </a>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex min-h-[8.25rem] flex-col justify-end bg-gradient-to-t from-black via-black/82 to-transparent p-5">
          <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-black text-white">
            {item.title}
          </h3>
          <p className="mt-2 overflow-hidden text-sm leading-6 text-white/68 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {item.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function PortfolioLoadingGrid() {
  return (
    <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-[18vw] md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0 md:pr-0 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({length: 4}).map((_, index) => (
        <div
          key={index}
          className="shrink-0 basis-[82vw] snap-start overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] sm:basis-[58vw] md:basis-auto"
        >
          <div className="relative aspect-[9/16] overflow-hidden bg-black">
            <div className="absolute inset-0 animate-pulse bg-[linear-gradient(115deg,rgba(255,255,255,0.035),rgba(255,255,255,0.12),rgba(255,255,255,0.035))]" />
            <div className="absolute left-3 top-3 size-10 animate-pulse rounded-full bg-white/10" />
            <div className="absolute right-3 top-3 size-10 animate-pulse rounded-full bg-white/10" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="h-6 w-2/3 animate-pulse rounded-full bg-white/14" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-white/10" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('All');
  const [cloudVideos, setCloudVideos] = useState<CloudPortfolioVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadVideos = (showLoading = false) => {
      if (showLoading) {
        setVideosLoading(true);
      }

      fetch('/api/portfolio-videos', {cache: 'no-store'})
        .then((response) => response.json())
        .then((data: {videos?: CloudPortfolioVideo[]}) => {
          if (active) {
            setCloudVideos(data.videos ?? []);
          }
        })
        .catch(() => {
          if (active) {
            setCloudVideos([]);
          }
        })
        .finally(() => {
          if (active && showLoading) {
            setVideosLoading(false);
          }
        });
    };

    loadVideos(true);
    const refreshInterval = window.setInterval(loadVideos, 5000);

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const cloudItems = useMemo<UploadedPortfolioItem[]>(() => {
    return cloudVideos.map((video) => ({
      type: 'uploaded',
      id: video.id,
      title: video.title,
      category: video.category,
      filterCategory: categoryToFilter[video.category] ?? 'Advertisement',
      videoUrl: video.video_url,
      description: video.description,
    }));
  }, [cloudVideos]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return cloudItems;
    }

    return cloudItems.filter((item) => item.filterCategory === activeFilter);
  }, [activeFilter, cloudItems]);

  return (
    <section id="work" className="overflow-hidden bg-[#080809] py-20 sm:py-32">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl min-w-0">
            <p className="section-kicker">Portfolio</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Work built for attention, clarity, and polish.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/56">
              Published AWS-hosted videos appear here automatically as vertical
              reel previews whenever the page refreshes.
            </p>
          </div>

          <div className="hide-scrollbar flex w-full max-w-full gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 lg:w-auto">
            {portfolioFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'text-white/62 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-8 md:mt-12">
          {videosLoading ? (
            <PortfolioLoadingGrid />
          ) : (
            <motion.div
              layout
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-[18vw] md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0 md:pr-0 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <UploadedPortfolioCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {!videosLoading && filteredItems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/14 bg-white/[0.025] p-8 text-center text-sm font-bold text-white/50">
            {activeFilter === 'All'
              ? 'No videos available yet.'
              : 'No videos available in this category yet.'}
          </div>
        ) : null}
      </div>
    </section>
  );
}
