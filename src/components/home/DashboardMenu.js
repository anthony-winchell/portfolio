"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { shouldIgnoreKey } from "@/lib/keys";

const items = [
  ...projects.map((project, index) => ({
    key: String(index + 1),
    label: project.name,
    file: project.file,
    href: `/projects/${project.slug}`,
  })),
  { key: "a", label: "About me", file: "about.md", href: "/about" },
];

export default function DashboardMenu() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.repeat || shouldIgnoreKey(event)) return;

      const item = items.find(({ key }) => key === event.key.toLowerCase());
      if (item) router.push(item.href);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <nav aria-label="Quick open" className="max-w-md font-mono">
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center gap-4 rounded px-3 py-2 hover:bg-line/60"
            >
              <kbd className="grid size-6 place-items-center rounded border border-line bg-bg-dark text-sm text-pink">
                {item.key}
              </kbd>
              <span>{item.label}</span>
              <span className="ml-auto text-sm text-muted group-hover:text-cyan">
                {item.file}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
