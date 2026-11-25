"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projectFiles, rootFiles } from "@/data/files";

function FileLink({ file, pathname, nested = false }) {
  const active = pathname === file.href;

  return (
    <li>
      <Link
        href={file.href}
        aria-current={active ? "page" : undefined}
        className={`block border-l-2 py-1.5 pr-4 -outline-offset-2 ${
          nested ? "pl-9" : "pl-4"
        } ${
          active
            ? "border-pink bg-line text-fg"
            : "border-transparent text-muted hover:bg-line/40 hover:text-fg"
        }`}
      >
        {file.name}
      </Link>
    </li>
  );
}

function Tree({ pathname }) {
  return (
    <ul>
      {rootFiles.map((file) => (
        <FileLink key={file.href} file={file} pathname={pathname} />
      ))}
      <li>
        <span className="block py-1.5 pl-4 text-purple">▾ projects/</span>
        <ul>
          {projectFiles.map((file) => (
            <FileLink key={file.href} file={file} pathname={pathname} nested />
          ))}
        </ul>
      </li>
    </ul>
  );
}

export default function FileTree() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Files"
      className="border-b border-line bg-bg-dark font-mono text-sm md:w-60 md:shrink-0 md:border-r md:border-b-0"
    >
      <details key={pathname} className="md:hidden">
        <summary className="cursor-pointer px-4 py-3 text-green -outline-offset-2">
          ~/anthony
        </summary>
        <div className="pb-3">
          <Tree pathname={pathname} />
        </div>
      </details>

      <div className="sticky top-12 hidden max-h-[calc(100dvh-5.25rem)] overflow-y-auto py-4 md:block">
        <p className="px-4 pb-2 text-green">~/anthony</p>
        <Tree pathname={pathname} />
      </div>
    </nav>
  );
}
