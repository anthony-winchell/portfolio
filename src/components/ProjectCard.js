const linkClass = "text-cyan underline underline-offset-4 hover:text-pink";

export default function ProjectCard({ project, headingLevel: Heading = "h2" }) {
  const { name, summary, highlights, tech, live, source } = project;

  return (
    <article className="rounded-lg border border-line bg-bg-dark p-6">
      <Heading className="text-xl font-bold text-pink">{name}</Heading>
      <p className="mt-2">{summary}</p>

      <ul className="mt-4 list-desc space-y-1 pl-5 text-muted marker:text-purple">
        {highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <ul
        aria-label="Technologies"
        className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-green"
      >
        {tech.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-5 font-mono text-sm empty:hidden">
        {live && (
          <a
            href={live}
            aria-label={`${name}: Live site`}
            className="linkClass"
          >
            Live site
          </a>
        )}
        {source.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-label={`${name}: ${link.label} on GitHub`}
            className={linkClass}
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}
