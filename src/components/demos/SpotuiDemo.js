"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { handlesKey, initialState, reducer } from "@/lib/spotui";
import SpotuiView from "./SpotuiView";

// The same actions as the keyboard, for touch screens.
const controls = [
  { key: "N", label: "Prev" },
  { key: " ", label: "Play/pause" },
  { key: "n", label: "Next" },
  { key: "-", label: "Vol -" },
  { key: "+", label: "Vol +" },
  { key: "s", label: "Shuffle" },
  { key: "r", label: "Repeat" },
];

export default function SpotuiDemo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [focused, setFocused] = useState(false);
  const screenRef = useRef(null);
  const searchRef = useRef(null);

  function focusScreen() {
    screenRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(timer);
  }, []);

  // Take the keyboard when the app starts, like a real terminal program.
  useEffect(() => {
    if (state.running) focusScreen();
  }, [state.running]);

  useEffect(() => {
    if (state.searching) searchRef.current?.focus({ preventScroll: true });
  }, [state.searching]);

  function handleKeyDown(event) {
    // The search box handles its own keys.
    if (event.target === searchRef.current) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!handlesKey(event.key)) return;

    event.preventDefault();
    dispatch({ type: "key", key: event.key });
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      dispatch({ type: "search", query: event.currentTarget.value });
      focusScreen();
    } else if (event.key === "Escape") {
      event.preventDefault();
      dispatch({ type: "cancelSearch" });
      focusScreen();
    }
  }

  // Clicked rows can disappear and take the focus with them, so keep it on the
  // screen itself. The search box is the exception.
  function handleClick(event) {
    if (!event.target.closest("input, [data-opens-search]")) focusScreen();
  }

  if (!state.running) {
    return (
      <div className="min-h-96 bg-bg px-8 py-10 font-mono text-[13px] leading-5">
        <p className="text-muted">spotui exited.</p>
        <button
          type="button"
          autoFocus
          onClick={() => dispatch({ type: "restart" })}
          className="mt-5 cursor-pointer text-cyan underline underline-offset-4 hover:text-pink"
        >
          Run it again
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        ref={screenRef}
        tabIndex={0}
        role="application"
        aria-label="spotui demo. The keys are listed at the bottom."
        data-insert
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="outline-none"
      >
        <SpotuiView
          state={state}
          onSection={(section) => dispatch({ type: "section", section })}
          onSelect={(index) => dispatch({ type: "select", index })}
          searchInput={
            <div className="flex gap-[1ch]">
              <span className="text-purple">/</span>
              <input
                ref={searchRef}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => dispatch({ type: "key", key: "/" })}
                onBlur={() => dispatch({ type: "cancelSearch" })}
                defaultValue={state.query}
                autoComplete="off"
                aria-label="Search"
                placeholder="tracks, artists, albums"
                className="w-full bg-transparent outline-none placeholder:text-comment"
              />
            </div>
          }
        />
      </div>

      <div
        className={`border-t-2 px-4 py-3 ${
          focused ? "border-green" : "border-line"
        }`}
      >
        <p className="mb-3 font-mono text-sm">
          {focused ? (
            <span className="text-green">
              ● Keyboard connected. Click elsewhere to release it.
            </span>
          ) : (
            <span className="text-muted">
              ○ Click the screen or press i to use the keyboard.
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2 font-mono text-sm">
          {controls.map((control) => (
            <button
              key={control.key}
              type="button"
              onClick={(event) => {
                dispatch({ type: "key", key: control.key });
                // `detail` is 0 when the button was pressed from the keyboard.
                if (event.detail > 0) focusScreen();
              }}
              className="cursor-pointer rounded border border-line px-2.5 py-1 hover:border-purple hover:text-purple"
            >
              {control.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          Simulated in your browser, following the real app&apos;s layout and
          key bindings. There is no sound.
        </p>
      </div>
    </>
  );
}
