'use client';

import {
  portfolioFilters,
  portfolioItems,
  type PortfolioFilter,
} from '@/data/portfolio';
import {AnimatePresence, motion} from 'framer-motion';
import {ExternalLink, Volume2, VolumeX} from 'lucide-react';
import Image from 'next/image';
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

type DummyPortfolioItem = (typeof portfolioItems)[number] & {
  type: 'dummy';
};

type DisplayPortfolioItem = UploadedPortfolioItem | DummyPortfolioItem;

const categoryToFilter: Record<string, Exclude<PortfolioFilter, 'All'>> = {
  'Tech Videos': 'Tech',
  'Entertainment Videos': 'Entertainment',
  'Reels & Shorts': 'Reels',
  'Motion Graphics': 'Motion Graphics',
  'Podcast Clips': 'Reels',
  'Brand Ads': 'Brand Videos',
  'YouTube Videos': 'YouTube',
  'Instagram Content': 'Reels',
  'AI-Generated Videos': 'Reels',
  'Cinematic Video Edits': 'Entertainment',
  'Product Promo Videos': 'Brand Videos',
  'Caption-Heavy Reels': 'Reels',
  'Vlog & Lifestyle Edits': 'Entertainment',
  'Event Highlight Videos': 'Entertainment',
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

function DummyPortfolioCard({item}: {item: DummyPortfolioItem}) {
  return (
    <motion.article
      layout
      key={item.title}
      initial={{opacity: 0, y: 28}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, scale: 0.96}}
      transition={{duration: 0.28}}
      className="group shrink-0 basis-[82vw] snap-start overflow-hidden rounded-lg premium-border sm:basis-[58vw] md:basis-auto"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-white/5">
        <Image
          src={item.thumbnail}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/55">
          <span className="translate-y-3 rounded-full bg-white px-4 py-2 text-sm font-black text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            Watch Project
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase text-[#66e8ff]">
            {item.category}
          </p>
          <a
            href={item.videoUrl}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/12 text-white/70 transition hover:bg-white hover:text-black"
            aria-label={`Watch ${item.title}`}
          >
            <ExternalLink size={16} />
          </a>
        </div>
        <h3 className="mt-3 text-xl font-black text-white">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/62">
          {item.description}
        </p>
        {item.result ? (
          <p className="mt-3 text-sm font-bold text-white">{item.result}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/62"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('All');
  const [cloudVideos, setCloudVideos] = useState<CloudPortfolioVideo[]>([]);

  useEffect(() => {
    let active = true;

    const loadVideos = () => {
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
        });

    };

    loadVideos();
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
      filterCategory: categoryToFilter[video.category] ?? 'Reels',
      videoUrl: video.video_url,
      description: video.description,
    }));
  }, [cloudVideos]);

  const displayItems = useMemo<DisplayPortfolioItem[]>(() => {
    if (cloudItems.length > 0) {
      return cloudItems;
    }

    return portfolioItems.map((item) => ({...item, type: 'dummy'}));
  }, [cloudItems]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return displayItems;
    }

    return displayItems.filter((item) => item.filterCategory === activeFilter);
  }, [activeFilter, displayItems]);

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
          <motion.div
            layout
            className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-[18vw] md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0 md:pr-0 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) =>
                item.type === 'uploaded' ? (
                  <UploadedPortfolioCard key={item.id} item={item} />
                ) : (
                  <DummyPortfolioCard key={item.title} item={item} />
                ),
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/14 bg-white/[0.025] p-8 text-center text-sm font-bold text-white/50">
            No uploaded videos in this portfolio filter yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
