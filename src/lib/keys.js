// True when a page-wide shortcut should leave a key press alone: it has a
// modifier, something else (like a demo) already handled it, the visitor is
// typing, or a dialog is open.
export function shouldIgnoreKey(event) {
  return (
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    Boolean(
      event.target.closest?.("input, textarea, select, [contenteditable]"),
    ) ||
    Boolean(document.querySelector("dialog[open]"))
  );
}

const SEQUENCE_TIMEOUT = 600;

// Returns a function that reports whether a key press completes "gg".
export function createDoubleG() {
  let last = -Infinity;

  return (event) => {
    const complete =
      event.key === "g" && event.timeStamp - last < SEQUENCE_TIMEOUT;
    last = event.key === "g" && !complete ? event.timeStamp : -Infinity;
    return complete;
  };
}
