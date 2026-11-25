"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { files, siblingFile } from "@/data/files";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { createDoubleG } from "@/lib/keys";

const commands = [
  ...files.map((file) => {
    const project = projects.find((item) => item.file === file.name);
    return { label: project?.name ?? file.name, hint: file.name, ...file };
  }),
  ...(site.resume
    ? [{ label: "Resume", hint: "pdf", href: site.resume, external: true }]
    : []),
  { label: "GitHub", hint: "link", href: site.github, external: true },
  { label: "LinkedIn", hint: "link", href: site.linkedin, external: true },
  {
    label: "Email",
    hint: "link",
    href: `mailto:${site.email}`,
    external: true,
  },
];

const shortcuts = [
  ["j k", "move"],
  ["gg G", "first, last"],
  ["h l", "previous, next file"],
  ["/", "search"],
  ["enter", "open"],
  ["esc", "close"],
];

// Like Telescope, this has two modes: the list has focus in normal mode, where
// the Vim keys work, and the search box has focus in insert mode.
export default function CommandPalette() {
  const pathname = usePathname();
  const router = useRouter();
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const isDoubleG = useRef(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const search = query.trim().toLowerCase();
  const matches = commands.filter(({ label, hint }) =>
    `${label} ${hint}`.toLowerCase().includes(search),
  );
  const last = Math.max(0, matches.length - 1);
  const activeId = matches.length > 0 ? `palette-${selected}` : undefined;

  function open() {
    setQuery("");
    setSelected(0);
    isDoubleG.current = createDoubleG();
    if (!dialogRef.current.open) dialogRef.current.showModal();
    listRef.current.focus();
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const modifier = event.ctrlKey || event.metaKey;
      if (!modifier || event.key.toLowerCase() !== "k") return;

      event.preventDefault();
      if (dialogRef.current.open) dialogRef.current.close();
      else open();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keep the selected row visible when the list scrolls.
  useEffect(() => {
    document
      .getElementById(`palette-${selected}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  function run(command) {
    if (!command) return;
    dialogRef.current.close();
    if (command.external) window.location.assign(command.href);
    else router.push(command.href);
  }

  function move(delta) {
    setSelected(Math.max(0, Math.min(last, selected + delta)));
  }

  function startSearch(text = "") {
    if (text) {
      setQuery(query + text);
      setSelected(0);
    }
    inputRef.current.focus();
  }

  function handleNormalKey(event) {
    if (isDoubleG.current(event)) {
      setSelected(0);
      return true;
    }

    switch (event.key) {
      case "j":
        move(1);
        return true;
      case "k":
        move(-1);
        return true;
      case "G":
        setSelected(last);
        return true;
      case "h":
      case "H":
        run(siblingFile(pathname, -1));
        return true;
      case "l":
      case "L":
        run(siblingFile(pathname, 1));
        return true;
      case "g":
        return true; // maybe the first half of "gg"
      case "/":
      case "i":
        startSearch();
        return true;
      case " ":
        return true; // don't scroll the list
    }

    // Any other character starts a search with it.
    if (event.key.length === 1) {
      startSearch(event.key);
      return true;
    }
    return false;
  }

  function handleKeyDown(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const searching = event.target === inputRef.current;
    let handled = true;

    if (event.key === "ArrowDown") move(1);
    else if (event.key === "ArrowUp") move(-1);
    else if (event.key === "Enter") run(matches[selected]);
    else if (event.key === "Escape" && searching) listRef.current.focus();
    else handled = !searching && handleNormalKey(event);

    if (handled) event.preventDefault();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open command palette"
        className="cursor-pointer px-4 py-2 text-muted -outline-offset-2 hover:text-fg"
      >
        <span className="sm:hidden">Menu</span>
        <span className="hidden sm:inline">Ctrl+K</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        // Only the backdrop makes the dialog itself the click target.
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-lg border border-purple bg-bg-dark font-mono text-sm text-fg shadow-xl backdrop:bg-bg-dark/80"
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <span aria-hidden="true" className="text-pink">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={activeId}
            aria-label="Find a file or link"
            autoComplete="off"
            placeholder="Press / or start typing to search"
            className="w-full bg-transparent py-3 outline-none placeholder:text-muted"
          />
        </div>

        <ul
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label="Files and links"
          aria-activedescendant={activeId}
          tabIndex={0}
          className="max-h-[50vh] overflow-y-auto py-2 outline-none"
        >
          {matches.map((command, index) => (
            <li
              key={command.href}
              id={`palette-${index}`}
              role="option"
              aria-selected={index === selected}
              onClick={() => run(command)}
              onMouseMove={() => setSelected(index)}
              className={`flex cursor-pointer justify-between gap-4 border-l-2 px-4 py-2 ${
                index === selected
                  ? "border-pink bg-line"
                  : "border-transparent"
              }`}
            >
              <span>{command.label}</span>
              <span className="text-muted">{command.hint}</span>
            </li>
          ))}
        </ul>
        {matches.length === 0 && (
          <p className="px-4 pb-4 text-muted">No matches.</p>
        )}

        <dl className="hidden flex-wrap gap-x-5 gap-y-1 border-t border-line px-4 py-2 text-xs text-muted sm:flex">
          {shortcuts.map(([keys, action]) => (
            <div key={keys} className="flex gap-2">
              <dt className="text-cyan">{keys}</dt>
              <dd>{action}</dd>
            </div>
          ))}
        </dl>
      </dialog>
    </>
  );
}
