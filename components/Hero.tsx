'use client';

import {motion} from 'framer-motion';
import {ArrowRight, Play} from 'lucide-react';
import {useEffect, useRef} from 'react';

const lineVariants = {
  hidden: {opacity: 1, y: 0},
  show: {opacity: 1, y: 0},
};

export function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    let retryTimer: number | undefined;

    const playVideo = () => {
      void video.play().catch(() => {
        window.clearTimeout(retryTimer);
        retryTimer = window.setTimeout(() => {
          void video.play().catch(() => undefined);
        }, 150);
      });
    };

    video.load();
    playVideo();
    window.requestAnimationFrame(playVideo);
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);

    return () => {
      window.clearTimeout(retryTimer);
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-black pt-20 sm:pt-28"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <video
          ref={videoRef}
          aria-label="Muted portfolio montage"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-100 brightness-[0.86] contrast-[1.08] saturate-[1.12]"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          src="/videos/dev-faststart.mp4?v=2"
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            void event.currentTarget.play();
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.30)_48%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="page-shell relative z-10 flex min-h-[calc(100vh-80px)] items-center py-12 sm:min-h-[calc(100vh-112px)] sm:py-20">
        <div className="min-w-0 max-w-3xl">
          <motion.div
            variants={{
              hidden: {},
              show: {transition: {staggerChildren: 0.12, delayChildren: 0.1}},
            }}
            initial="show"
            animate="show"
          >
            <motion.p
              variants={lineVariants}
              className="section-kicker mb-4 max-w-[18rem] sm:mb-5 sm:max-w-none"
            >
              Video Editor + AI-Assisted Creative Workflow Specialist
            </motion.p>
            <motion.h1
              variants={lineVariants}
              className="max-w-[21rem] text-[2.65rem] font-black leading-[1.03] text-white [overflow-wrap:anywhere] sm:max-w-3xl sm:text-6xl xl:text-7xl"
            >
              Make Your Videos Look Premium, Engaging & Scroll-Stopping
            </motion.h1>
            <motion.p
              variants={lineVariants}
              className="mt-5 max-w-[21rem] text-base leading-7 text-white/72 sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-8"
            >
              I’m Shivam, a video editor with 4 years of experience and 200+
              videos edited across reels, shorts, tech videos, entertainment
              edits, and motion graphics.
            </motion.p>
            <motion.div
              variants={lineVariants}
              className="mt-6 flex w-full max-w-[21rem] rounded-3xl border border-white/14 bg-white/8 px-4 py-3 text-sm font-bold leading-5 text-white shadow-2xl shadow-black/30 backdrop-blur sm:mt-7 sm:inline-flex sm:w-auto sm:max-w-full sm:rounded-full"
            >
              <span className="min-w-0 whitespace-normal sm:truncate">
                4 Years Experience • 200+ Videos Edited • AI-Assisted Workflow
              </span>
            </motion.div>
            <motion.div
              variants={lineVariants}
              className="mt-8 flex w-full max-w-[21rem] flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row"
            >
              <a
                href="#work"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-black transition hover:bg-[#d7ff65] sm:w-auto"
              >
                <Play size={18} fill="currentColor" />
                Watch My Work
              </a>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/18 bg-white/7 px-6 py-4 text-sm font-black text-white transition hover:border-white hover:bg-white hover:text-black sm:w-auto"
              >
                Contact Me
                <ArrowRight size={18} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
