'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden bg-[#050507] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(137,88,255,0.24),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(102,232,255,0.10),transparent_28%),linear-gradient(180deg,#050507,#08070d_48%,#050507)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="page-shell relative z-10">
        <motion.div
          initial={{opacity: 0, y: 30, scale: 0.985}}
          whileInView={{opacity: 1, y: 0, scale: 1}}
          viewport={{once: true, amount: 0.18}}
          transition={{duration: 0.75, ease: [0.22, 1, 0.36, 1]}}
          className="relative mx-auto max-w-[980px]"
        >
          <div className="absolute -inset-4 rounded-[42px] bg-[#8c5cff]/22 blur-3xl sm:-inset-7" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.055] p-2 shadow-[0_36px_130px_rgba(0,0,0,0.72)] backdrop-blur-xl sm:rounded-[42px] sm:p-3">
            <div className="relative overflow-hidden rounded-[24px] bg-[#050507] sm:rounded-[32px]">
              <Image
                src="/images/generated/shivam-creative-tools-poster.png"
                alt="Poster for Shivam, AI-based video editor, with Premiere Pro, After Effects, DaVinci Resolve, reels, motion design, 200+ videos, and AI workflow"
                width={1254}
                height={1254}
                sizes="(max-width: 768px) calc(100vw - 32px), 980px"
                priority
                className="h-auto w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
