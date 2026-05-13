export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] py-8">
      <div className="page-shell flex flex-col justify-between gap-5 text-center text-sm text-white/52 md:flex-row md:items-center md:text-left">
        <div className="space-y-1">
          <p className="font-black text-white">Shivam</p>
          <p>© 2026 Shivam. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:justify-end">
          <a href="#work" className="transition hover:text-white">
            Work
          </a>
          <a href="#ai-workflow" className="transition hover:text-white">
            AI Workflow
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
