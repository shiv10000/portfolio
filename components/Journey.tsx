'use client';

import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from 'framer-motion';
import {useEffect, useRef} from 'react';

const journey = [
  {
    year: '2021',
    title: 'Started Editing',
    description: 'Started learning video editing during graduation.',
  },
  {
    year: '2022',
    title: 'First Projects',
    description: 'Worked on short videos, reels, and social media content.',
  },
  {
    year: '2023',
    title: 'Improved Workflow',
    description:
      'Learned better pacing, captions, sound design, and storytelling.',
  },
  {
    year: '2024',
    title: 'Motion Graphics',
    description: 'Started creating motion graphics and advanced visual edits.',
  },
  {
    year: '2025',
    title: 'AI-Assisted Workflow',
    description:
      'Added tools like ChatGPT, Runway, and AI creative tools into the workflow.',
  },
  {
    year: 'Now',
    title: '200+ Videos Edited',
    description:
      'Helping creators and brands make professional, engaging videos.',
  },
];

export function Journey() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const line = lineRef.current;

    if (!section || !line) {
      return;
    }

    const tween = gsap.fromTo(
      line,
      {scaleY: 0},
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 55%',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="bg-[#080809] py-24 sm:py-32">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">Journey</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            Four years of building better creative instincts.
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-1/2" />
          <div
            ref={lineRef}
            className="absolute bottom-0 left-4 top-0 w-px origin-top bg-[#66e8ff] md:left-1/2"
          />

          <div className="grid gap-8">
            {journey.map((item, index) => (
              <motion.article
                key={`${item.year}-${item.title}`}
                initial={{opacity: 0, y: 28}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.35}}
                className={`relative grid gap-4 pl-12 md:grid-cols-2 md:pl-0 ${
                  index % 2 === 0 ? '' : 'md:[&>*:first-child]:col-start-2'
                }`}
              >
                <span className="absolute left-[11px] top-7 z-10 size-3 rounded-full bg-[#66e8ff] shadow-[0_0_24px_rgba(102,232,255,0.6)] md:left-[calc(50%-6px)]" />
                <div
                  className={`rounded-lg premium-border p-6 ${
                    index % 2 === 0 ? 'md:mr-10' : 'md:ml-10'
                  }`}
                >
                  <p className="text-sm font-black text-[#66e8ff]">{item.year}</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
