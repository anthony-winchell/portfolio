const keywords =
  "func|select|case|default|return|if|else|for|go|type|struct|chan|any|nil";

// A small highlighter for short Go and Java snippets: comments, strings,
// keywords, then function names.
const pattern = new RegExp(
  `(//.*)|("[^"\\n]*")|\\b(${keywords})\\b|\\b([A-Za-z_]\\w*)(?=\\()`,
  "g",
);

const colors = ["text-muted", "text-yellow", "text-pink", "text-green"];

function highlight(text) {
  const parts = [];
  let position = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > position) parts.push(text.slice(position, match.index));

    // Groups 1-4 line up with `colors`; exactly one of them matched.
    const group = match.slice(1).findIndex((value) => value !== undefined);
    parts.push(
      <span key={match.index} className={colors[group]}>
        {match[0]}
      </span>,
    );
    position = match.index + match[0].length;
  }

  parts.push(text.slice(position));
  return parts;
}

export default function CodeBlock({ file, text }) {
  return (
    <figure className="overflow-hidden rounded border border-line bg-bg-dark font-mono text-sm">
      <figcaption className="border-b border-line px-4 py-2 text-muted">
        {file}
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={`Code from ${file}`}
        className="overflow-x-auto p-4 leading-relaxed [tab-size:4] -outline-offset-2"
      >
        <code>{highlight(text)}</code>
      </pre>
    </figure>
  );
}
