export default function Window({ title, children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-line bg-bg-dark shadow-xl shadow-bg-dark/60 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red" />
        <span className="size-2.5 rounded-full bg-yellow" />
        <span className="size-2.5 rounded-full bg-green" />
        <span className="ml-2 truncate font-mono text-xs text-muted">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
