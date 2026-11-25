"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CommandPalette from "@/components/CommandPalette";
import { projectFiles, rootFiles } from "@/data/files";
import { site } from "@/data/site";

function locate(pathname) {
  const root = rootFiles.find((file) => file.href === pathname);
  if (root) return `~/${root.name}`;

  const project = projectFiles.find((file) => file.href === pathname);
  // A 404 page is prerendered without knowing its URL, so it can't show one.
  return project ? `~/projects/${project.name}` : "[No Name]";
}

// INSERT while a text field has focus, NORMAL the rest of the time.
function useMode() {
  const [mode, setMode] = useState("NORMAL");

  useEffect(() => {
    function enter(event) {
      setMode(event.target.matches("input, textarea") ? "INSERT" : "NORMAL");
    }
    function leave() {
      setMode("NORMAL");
    }

    document.addEventListener("focusin", enter);
    document.addEventListener("focusout", leave);
    return () => {
      document.removeEventListener("focusin", enter);
      document.removeEventListener("focusout", leave);
    };
  }, []);

  return mode;
}

export default function StatusLine() {
  const pathname = usePathname();
  const mode = useMode();

  return (
    <footer className="sticky bottom-0 z-10 flex items-stretch bg-bg-dark font-mono text-sm">
      <span
        aria-hidden="true"
        className={`hidden px-4 py-2 font-bold text-bg-dark sm:block ${
          mode === "INSERT" ? "bg-green" : "bg-purple"
        }`}
      >
        {mode}
      </span>
      <span className="min-w-0 flex-1 truncate px-4 py-2 text-muted">
        {locate(pathname)}
      </span>
      <CommandPalette />
      <a
        href={site.github}
        className="px-4 py-2 text-cyan -outline-offset-2 hover:text-pink"
      >
        GitHub
      </a>
      <a
        href={`mailto:${site.email}`}
        className="hidden px-4 py-2 text-cyan -outline-offset-2 hover:text-pink sm:block"
      >
        Email
      </a>
    </footer>
  );
}
