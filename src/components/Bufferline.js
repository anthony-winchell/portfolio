"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { files } from "@/data/files";

export default function Bufferline() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 hidden h-12 border-b border-line bg-bg-dark md:block">
      <nav
        aria-label="Open buffers"
        className="flex h-full overflow-x-auto font-mono text-sm"
      >
        {files.map((file) => {
          const active = pathname === file.href;

          return (
            <Link
              key={file.href}
              href={file.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center border-t-2 border-r border-r-line px-5 -outline-offset-2 ${
                active
                  ? "border-t-purple bg-bg text-fg"
                  : "border-t-transparent text-muted hover:text-fg"
              }`}
            >
              {file.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
