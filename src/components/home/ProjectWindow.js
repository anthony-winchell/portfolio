import Link from "next/link";
import Window from "@/components/Window";
import { previews } from "./previews";

export default function ProjectWindow({ project, flipped }) {
  const preview = previews[project.slug];
  const Preview = preview?.Component;

  return (
    <article className="group relative grid items-center gap-x-10 gap-y-4 @4xl:grid-cols-5">
      {Preview && (
        <div
          aria-hidden="true"
          inert
          className={`min-w-0 @4xl:col-span-3 ${flipped ? "@4xl:order-last" : ""}`}
        >
          <Window
            title={preview.title}
            className="transition group-focus-within:border-purple group-hover:border-purple motion-safe:group-hover:-translate-y-1"
          >
            <Preview />
          </Window>
        </div>
      )}

      <div className="min-w-0 @4xl:col-span-2">
        <h3 className="text-2xl font-bold">
          {/* The ::after covers the article, so the whole window is clickable. */}
          <Link
            href={`/projects/${project.slug}`}
            className="text-pink group-hover:text-cyan after:absolute after:inset-0 after:rounded-lg"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{project.summary}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted marker:text-purple">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <TechList tech={project.tech} />
      </div>
    </article>
  );
}

function TechList({ tech }) {
  return (
    <ul
      aria-label="Technologies"
      className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-green"
    >
      {tech.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
