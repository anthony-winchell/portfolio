"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { initialState, reducer, ROOM_PASSWORD } from "@/lib/tuchat";
import TuChatView from "./TuChatView";

const replies = [
  "hey, welcome in",
  "try making your own room with /join",
  "there's a locked room too, if you're curious",
  "don't mind me, I'm scripted",
];

const inputClass =
  "w-full bg-transparent outline-none placeholder:text-[#808080]";

function now() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TuChatDemo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const replyCount = useRef(0);
  const timers = useRef(new Set());

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [state.entries]);

  // Cancel any pending replies when the visitor leaves the page.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function scheduleReply() {
    const [nickname] = state.rooms[state.room].users;
    const text = replies[replyCount.current];
    if (!nickname || !text) return;

    replyCount.current += 1;
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      dispatch({
        type: "remote",
        room: state.room,
        nickname,
        text,
        time: now(),
      });
    }, 1200);
    timers.current.add(timer);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setDraft("");

    if (state.awaitingPassword) {
      dispatch({ type: "password", value: draft, time: now() });
      return;
    }

    dispatch({ type: "submit", text: draft, time: now() });
    const text = draft.trim();
    if (text && !text.startsWith("/")) scheduleReply();
  }

  // The real client's keys. Enter is handled by the form.
  function handleKeyDown(event) {
    const inRooms = state.tab === "rooms" && !state.awaitingPassword;
    let handled = true;

    if (event.key === "Escape") {
      if (state.awaitingPassword) {
        setDraft("");
        dispatch({ type: "cancelPassword" });
      } else {
        // Not in the real client: gives the keyboard back to the page.
        event.currentTarget.blur();
      }
    } else if (event.key === "Tab" && !event.shiftKey) {
      dispatch({ type: "tab", tab: state.tab === "users" ? "rooms" : "users" });
    } else if (event.key === "ArrowUp" && inRooms) {
      dispatch({ type: "moveRoom", delta: -1 });
    } else if (event.key === "ArrowDown" && inRooms) {
      dispatch({ type: "moveRoom", delta: 1 });
    } else if (event.ctrlKey && event.key.toLowerCase() === "j" && inRooms) {
      setDraft("");
      dispatch({ type: "join", room: state.selectedRoom, time: now() });
    } else {
      handled = false;
    }

    if (handled) event.preventDefault();
  }

  // Clicking anywhere in the terminal types into it. Selecting text doesn't,
  // and neither does touch, where it would bring up the on-screen keyboard.
  function handleClick(event) {
    const byMouse = event.detail > 0 && matchMedia("(pointer: fine)").matches;
    if (byMouse && getSelection().isCollapsed) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }

  if (!state.connected) {
    return (
      <div className="min-h-96 bg-[#191a21] px-8 py-10 font-mono text-[13px] leading-5">
        <p>Disconnected from server</p>
        <p className="mt-5">EOF</p>
        <button
          type="button"
          autoFocus
          onClick={() => dispatch({ type: "reset" })}
          className="mt-5 cursor-pointer text-cyan underline underline-offset-4 hover:text-pink"
        >
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <div onClick={handleClick}>
        <TuChatView
          state={state}
          onTab={(tab) => dispatch({ type: "tab", tab })}
          onJoin={(room) => {
            setDraft("");
            dispatch({ type: "join", room, time: now() });
          }}
          logProps={{
            ref: logRef,
            role: "log",
            "aria-label": "Chat messages",
            tabIndex: 0,
          }}
          className="h-80"
          input={
            <form onSubmit={handleSubmit} className="flex gap-[1ch]">
              {state.awaitingPassword && <span aria-hidden="true">🔒</span>}
              <input
                ref={inputRef}
                data-insert
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={2000}
                autoComplete="off"
                aria-describedby="tuchat-help"
                aria-label={
                  state.awaitingPassword
                    ? "Room password"
                    : "Message or command"
                }
                placeholder={
                  state.awaitingPassword
                    ? "room password"
                    : "message or /command"
                }
                className={`${inputClass} ${
                  state.awaitingPassword ? "[-webkit-text-security:disc]" : ""
                }`}
              />
            </form>
          }
        />
      </div>

      <div
        className={`border-t-2 px-4 py-3 text-sm ${
          focused ? "border-green" : "border-line"
        }`}
      >
        <p id="tuchat-help" className="mb-2 font-mono">
          {focused ? (
            <span className="text-green">
              ● Keyboard connected. Esc releases it.
            </span>
          ) : (
            <span className="text-muted">
              ○ Click the screen or press i to type.
            </span>
          )}
        </p>
        <p className="text-muted">
          Simulated in your browser, with the real client&apos;s layout, keys,
          and messages. Try <code className="font-mono text-pink">/help</code>,{" "}
          <code className="font-mono text-pink">/nick</code>, or{" "}
          <code className="font-mono text-pink">/join golang</code>. The
          password for <code className="font-mono text-pink">ops</code> is{" "}
          <code className="font-mono text-pink">{ROOM_PASSWORD}</code>.
        </p>
      </div>
    </>
  );
}
