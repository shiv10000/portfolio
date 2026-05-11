'use client';

import {motion} from 'framer-motion';
import {
  BadgeCheck,
  Captions,
  Image as ImageIcon,
  Mic,
  Palette,
  Play,
  Scissors,
  Smartphone,
  Sparkles,
  Volume2,
  WandSparkles,
} from 'lucide-react';
import {services} from '@/data/services';

const iconMap = {
  badge: BadgeCheck,
  captions: Captions,
  image: ImageIcon,
  mic: Mic,
  palette: Palette,
  play: Play,
  scissors: Scissors,
  smartphone: Smartphone,
  sparkles: Sparkles,
  volume: Volume2,
  wand: WandSparkles,
};

export function Services() {
  return (
    <section id="services" className="bg-[#f6f4ee] py-24 text-black sm:py-32">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase text-black/55">Services</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            Hire for the edits that need to feel finished.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Sparkles;

            return (
              <motion.article
                key={service.title}
                initial={{opacity: 0, y: 28}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.3}}
                transition={{delay: index * 0.035}}
                className="rounded-lg border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:border-black hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="flex size-11 items-center justify-center rounded-md bg-black text-white">
                  <Icon size={21} />
                </div>
                <h3 className="mt-5 text-lg font-black">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
