'use client';

import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useEffect, useRef, useState} from 'react';

const messages = [
  'Editing is not just cutting clips.',
  'It is rhythm, emotion, hook, pacing, retention, design, and storytelling.',
  'I make videos feel sharper, cleaner, and more watchable.',
];

export function BrandMessage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${messages.length * 420}`,
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const nextIndex = Math.min(
          messages.length - 1,
          Math.floor(self.progress * messages.length),
        );
        setActiveIndex(nextIndex);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black py-24 sm:py-32">
      <div className="absolute inset-0 grid-surface opacity-20" />
      <div className="page-shell relative z-10 flex min-h-[70vh] items-center">
        <div className="max-w-5xl">
          <p className="section-kicker">Brand Message</p>
          <div className="relative mt-8 min-h-[240px]">
            {messages.map((message, index) => (
              <div
                key={message}
                className={`absolute inset-0 transition duration-500 ${
                  activeIndex === index
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <p className="text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
                  {message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
