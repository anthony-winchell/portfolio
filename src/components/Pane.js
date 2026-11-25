export default function Pane({ title, children }) {
  return (
    <section aria-label={title} className="min-w-0 rounded border border-line">
      <p className="border-b border-line bg-bg-dark px-4 py-2 font-mono text-sm text-muted">
        {title}
      </p>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}
