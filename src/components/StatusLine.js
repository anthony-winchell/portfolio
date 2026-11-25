"use client";

import { usePathname } from "next/navigation";

export default function StatusLine() {
  const pathname = usePathname();
  const location = pathname === "/" ? "~/about.md" : `~${pathname}`;

  return (
    <footer className="sticky bottom-0 z-10 flex items-stretch bg-bg-dark font-mono text-sm">
      <span
        aria-hidden="true"
        className="hidden bg-purple px-4 py-2 font-bold text-bg-dark sm:block"
      >
        NORMAL
      </span>
      <span className="min-w-0 flex-1 truncate px-4 py-2 text-muted">
        {location}
      </span>
      <a
        href="https://github.com/anthony-winchell"
        className="px-4 py-2 text-cyan -outline-offset-2 hover:text-pink "
      >
        GitHub
      </a>
      <a
        href="mailto:anthony.winchell.56@gmail.com"
        className="px-4 py-2 text-cyan -outline-offset-2 hover:text-pink"
      >
        Email
      </a>
    </footer>
  );
}
