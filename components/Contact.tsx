'use client';

import {motion} from 'framer-motion';
import {Camera, Mail, MessageCircle, Send} from 'lucide-react';
import type {FormEvent} from 'react';

const whatsappPhoneNumber = '919118345467';
const emailAddress = 'shivam.editing.creative@gmail.com';
const inquiryText =
  'Hi Shivam, I want to discuss a video editing project with you.';

const contactLinks = [
  {
    label: 'WhatsApp Me',
    href: whatsappPhoneNumber
      ? `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(inquiryText)}`
      : '#contact',
    icon: MessageCircle,
  },
  {
    label: 'Email Me',
    href: emailAddress
      ? `mailto:${emailAddress}?subject=${encodeURIComponent('Video editing project inquiry')}&body=${encodeURIComponent(inquiryText)}`
      : '#contact',
    icon: Mail,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/shivamseek/',
    icon: Camera,
  },
];

export function Contact() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const visitorEmail = String(formData.get('email') ?? '').trim();
    const projectType = String(formData.get('projectType') ?? '').trim();
    const budget = String(formData.get('budget') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    const subject = `Video editing project inquiry${name ? ` from ${name}` : ''}`;
    const body = [
      `Name: ${name || 'Not provided'}`,
      `Email: ${visitorEmail || 'Not provided'}`,
      `Project Type: ${projectType || 'Not selected'}`,
      `Budget: ${budget || 'Not provided'}`,
      '',
      'Message:',
      message || 'Not provided',
    ].join('\n');

    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-black py-20 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(102,232,255,0.12),transparent_36%,rgba(255,122,144,0.12)_100%)]" />
      <div className="page-shell relative z-10">
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          className="grid gap-8 rounded-lg border border-white/13 bg-[#080809]/92 p-6 shadow-2xl shadow-black/50 backdrop-blur md:p-8 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div>
            <p className="section-kicker">Contact</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Have raw footage? Let’s turn it into something worth watching.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/66">
              Available for reels, shorts, YouTube videos, brand edits, and
              motion graphics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {contactLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-4 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
                  >
                    <Icon size={18} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-white/72">
                Name
                <input
                  name="name"
                  required
                  className="rounded-md border border-white/12 bg-white/7 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#66e8ff]"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/72">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-md border border-white/12 bg-white/7 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#66e8ff]"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-white/72">
                Project Type
                <select
                  name="projectType"
                  required
                  className="rounded-md border border-white/12 bg-[#111113] px-4 py-3 text-white outline-none transition focus:border-[#66e8ff]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option>Reels / Shorts</option>
                  <option>YouTube Video</option>
                  <option>Brand Video</option>
                  <option>Motion Graphics</option>
                  <option>Podcast Clips</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/72">
                Budget
                <input
                  name="budget"
                  className="rounded-md border border-white/12 bg-white/7 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#66e8ff]"
                  placeholder="Project budget"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Message
              <textarea
                name="message"
                required
                rows={5}
                className="resize-none rounded-md border border-white/12 bg-white/7 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#66e8ff]"
                placeholder="Tell me about the footage, platform, and deadline."
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-black transition hover:bg-[#d7ff65] sm:w-auto"
            >
              Send Project Brief
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
