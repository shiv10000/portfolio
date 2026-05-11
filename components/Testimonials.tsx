'use client';

import {Quote} from 'lucide-react';
import {testimonials} from '@/data/testimonials';

export function Testimonials() {
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-black py-20 sm:py-32">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">Client Reviews</p>
          <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
            Clear edits, smooth communication, stronger content.
          </h2>
        </div>
      </div>

      <div className="mt-12 overflow-hidden masked-fade">
        <div className="marquee-track flex w-max gap-5 px-4">
          {marqueeItems.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="w-[82vw] max-w-[320px] shrink-0 rounded-lg border border-white/12 bg-white/6 p-5 sm:w-[420px] sm:max-w-none sm:p-6"
            >
              <Quote className="text-[#66e8ff]" size={28} />
              <p className="mt-5 min-h-[132px] text-base leading-7 text-white/72">
                “{review.quote}”
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-black text-white">{review.name}</p>
                <p className="mt-1 text-sm text-white/48">{review.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
