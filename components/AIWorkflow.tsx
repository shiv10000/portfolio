'use client';

import {motion} from 'framer-motion';
import {Bot, Clapperboard, Film, Layers, MessageSquareText, Sparkles} from 'lucide-react';
import {creativeTools} from '@/data/tools';

const workflow = [
  {
    title: 'Hook & Script Ideas',
    description:
      'Using ChatGPT for hooks, captions, content structure, and storytelling ideas.',
    icon: MessageSquareText,
  },
  {
    title: 'Visual Concepting',
    description:
      'Using AI tools for references, creative direction, and moodboard ideas.',
    icon: Sparkles,
  },
  {
    title: 'Video Enhancement',
    description:
      'Using Runway for AI cleanup, generation, and enhancement support.',
    icon: Bot,
  },
  {
    title: 'Editing',
    description:
      'Using Premiere Pro for timeline editing, pacing, captions, sound, and final structure.',
    icon: Film,
  },
  {
    title: 'Motion Graphics',
    description:
      'Using After Effects for animated text, transitions, titles, and visual effects.',
    icon: Layers,
  },
  {
    title: 'Final Polish',
    description:
      'Color correction, sound cleanup, export, and platform optimization.',
    icon: Clapperboard,
  },
];

export function AIWorkflow() {
  return (
    <section id="ai-workflow" className="overflow-hidden bg-[#090909] py-20 sm:py-32">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="section-kicker">Modern Process</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              AI-Powered Creative Workflow
            </h2>
            <p className="mt-6 text-base leading-8 text-white/66">
              I use AI tools to speed up ideation, improve visual quality,
              create better concepts, and support the editing process while
              keeping the final creative control human and professional.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {creativeTools.map((tool, index) => (
                <motion.span
                  key={tool.name}
                  animate={{y: [0, index % 2 ? 6 : -6, 0]}}
                  transition={{duration: 5 + index * 0.2, repeat: Infinity, ease: 'easeInOut'}}
                  className="rounded-full border border-white/11 bg-white/5 px-3 py-2 text-xs font-black text-white"
                  style={{boxShadow: `0 0 0 1px ${tool.accent ?? '#ffffff'}22`}}
                >
                  {tool.name}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-px bg-white/10" />
            <div className="grid gap-5">
              {workflow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.title}
                    initial={{opacity: 0, x: 30}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true, amount: 0.3}}
                    transition={{delay: index * 0.06}}
                    className="relative ml-0 rounded-lg premium-border p-4 pl-[4.5rem] transition hover:border-[#d7ff65]/50 hover:shadow-[0_0_50px_rgba(215,255,101,0.08)] sm:p-5 sm:pl-20"
                  >
                    <div className="absolute left-3 top-5 flex size-12 items-center justify-center rounded-md bg-white text-black">
                      <Icon size={22} />
                    </div>
                    <p className="text-sm font-black text-[#66e8ff]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/62">
                      {step.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
