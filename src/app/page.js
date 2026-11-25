const swatches = [
  { name: "purple", className: "bg-purple" },
  { name: "pink", className: "bg-pink" },
  { name: "green", className: "bg-green" },
  { name: "cyan", className: "bg-cyan" },
  { name: "yellow", className: "bg-yellow" },
  { name: "orange", className: "bg-orange" },
  { name: "red", className: "bg-red" },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-24">
      <p className="font-mono text-sm text-green">~/portfolio</p>
      <h1 className="mt-2 text-4xl font-bold text-purple">Anthony Winchell</h1>
      <p className="mt-4 text-lg">
        Body text uses Inter. Headings and UI use{" "}
        <code className="font-mono text-pink">JetBrains Mono</code>.
      </p>
      <p className="mt-2 text-muted">Secondary text uses the muted color.</p>
      <a
        href="https://github.com/anthony-winchell"
        className="mt-6 inline-block font-mono text-cyan underline underline-offset-4 hover:text-pink"
      >
        GitHub
      </a>

      <ul className="mt-12 grid grid-cols-2 gap-4 rounded-lg border border-line bg-bg-dark p-6 sm:grid-cols-4">
        {swatches.map((swatch) => (
          <li key={swatch.name} className="font-mono text-sm">
            <div className={`mb-2 h-10 rounded ${swatch.className}`} />
            {swatch.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
