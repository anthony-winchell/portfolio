"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { siblingFile } from "@/data/files";
import { createDoubleG, shouldIgnoreKey } from "@/lib/keys";

const SCROLL_STEP = 80;

// Page-wide Vim motions. Renders nothing.
export default function VimKeys() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isDoubleG = createDoubleG();

    function openSibling(delta) {
      const file = siblingFile(pathname, delta);
      if (file) router.push(file.href);
    }

    function handleKeyDown(event) {
      if (shouldIgnoreKey(event)) return;

      if (isDoubleG(event)) {
        window.scrollTo(0, 0);
        return;
      }

      switch (event.key) {
        case "j":
          window.scrollBy(0, SCROLL_STEP);
          break;
        case "k":
          window.scrollBy(0, -SCROLL_STEP);
          break;
        case "G":
          window.scrollTo(0, document.documentElement.scrollHeight);
          break;
        case "h":
        case "H":
          openSibling(-1);
          break;
        case "l":
        case "L":
          openSibling(1);
          break;
        case "i": {
          // Step into the page's demo, if it has one.
          const target = document.querySelector("[data-insert]");
          if (target) {
            event.preventDefault();
            target.focus();
          }
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);

  return null;
}
