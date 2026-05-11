'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {Menu, X} from 'lucide-react';
import {useState} from 'react';

const links = [
  {label: 'Home', href: '#home'},
  {label: 'Work', href: '#work'},
  {label: 'AI Workflow', href: '#ai-workflow'},
  {label: 'Contact', href: '#contact'},
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <nav className="page-shell flex h-20 items-center justify-between">
        <a href="#home" className="group flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md border border-white/15 bg-white text-sm font-black text-black">
            S
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black text-white">Shivam</span>
            <span className="mt-1 block text-xs text-white/55">Video Editor</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/66 transition hover:bg-white hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-[#d7ff65] lg:inline-flex"
        >
          Start a Project
        </a>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{opacity: 0, y: -12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -12}}
            className="page-shell pb-5 md:hidden"
          >
            <div className="grid gap-2 rounded-lg border border-white/10 bg-[#0d0d0e] p-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white hover:text-black"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
