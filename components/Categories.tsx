'use client';

import {categories} from '@/data/categories';
import {
  Bot,
  BriefcaseBusiness,
  Clapperboard,
  Cpu,
  Film,
  ImagePlay,
  Sparkles,
  Video,
} from 'lucide-react';

const categoryIcons = [
  Cpu,
  Film,
  ImagePlay,
  Sparkles,
  BriefcaseBusiness,
  Bot,
  Video,
  Clapperboard,
];

const cardAccents = [
  'from-[#66e8ff]/22 via-white/[0.055] to-[#8c5cff]/16',
  'from-[#ff7a90]/20 via-white/[0.055] to-[#66e8ff]/12',
  'from-[#d7ff65]/18 via-white/[0.055] to-[#66e8ff]/14',
  'from-[#8c5cff]/24 via-white/[0.055] to-[#ff7a90]/12',
  'from-[#66e8ff]/18 via-white/[0.055] to-[#f7f7f2]/10',
  'from-[#f7f7f2]/12 via-white/[0.055] to-[#d7ff65]/16',
  'from-[#8c5cff]/22 via-white/[0.055] to-[#66e8ff]/12',
];

const visibleCategoryNames = [
  'Tech',
  'Cinematic',
  'AI Videos',
  'Event',
  'Advertisement',
];

export function Categories() {
  const visibleCategories = visibleCategoryNames
    .map((name) => categories.find((category) => category.name === name))
    .filter((category): category is (typeof categories)[number] => Boolean(category));

  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(102,232,255,0.13),transparent_30%),radial-gradient(circle_at_82%_38%,rgba(140,92,255,0.18),transparent_28%)]" />
      <div className="page-shell relative z-10">
        <div className="max-w-2xl">
          <p className="section-kicker">Video Categories</p>
          <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
            The types of videos I make.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/56">
            A quick look at the core formats I edit for creators, brands, and
            social-first content.
          </p>
        </div>

        <div className="category-loop-shell mt-12 overflow-hidden">
          <div className="category-loop-track flex w-max gap-5 pb-6">
            {[...visibleCategories, ...visibleCategories].map((category, index) => {
              const originalIndex = index % visibleCategories.length;
              const Icon = categoryIcons[originalIndex] ?? Clapperboard;
              const isDuplicate = index >= visibleCategories.length;

              return (
                <article
                  key={`${category.name}-${index}`}
                  aria-hidden={isDuplicate}
                  className={`relative flex min-h-[340px] w-[82vw] max-w-[310px] shrink-0 flex-col justify-between overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${cardAccents[originalIndex]} p-5 shadow-[0_22px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:min-h-[360px] sm:w-[340px] sm:max-w-none sm:p-6`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_38%,rgba(255,255,255,0.035))]" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="flex h-15 w-15 items-center justify-center rounded-2xl border border-white/12 bg-black/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl">
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/24 px-3 py-1 text-xs font-black uppercase text-white/44">
                        {String(originalIndex + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-8 text-2xl font-black leading-tight text-white sm:text-3xl">
                      {category.name}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/62">
                      {category.description}
                    </p>
                  </div>

                  <div className="relative mt-8">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />
                    <p className="mt-5 text-xs font-black uppercase text-white/38">
                      {category.folder}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
