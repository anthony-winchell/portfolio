"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const buffers = [
  { href: "/", label: "about.md" },
  { href: "/projects", label: "projects/" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Bufferline() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg-dark">
      <nav aria-label="Main" className="flex overflow-x-auto font-mono text-sm">
        {buffers.map((buffer) => {
          const active = isActive(pathname, buffer.href);

          return (
            <Link
              key={buffer.href}
              href={buffer.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 border-t-2 px-5 py-3 -outline-offset-2 ${
                active
                  ? "border-purple bg-bg text-fg"
                  : "border-transparent text-muted hover:text-fg"
              }`}
            >
              {buffer.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
