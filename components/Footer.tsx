export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] py-10">
      <div className="page-shell flex flex-col justify-between gap-5 text-sm text-white/52 md:flex-row md:items-center">
        <div>
          <p className="font-black text-white">Shivam</p>
          <p className="mt-1">
            Video Editor + AI-Assisted Creative Workflow Specialist
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
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
