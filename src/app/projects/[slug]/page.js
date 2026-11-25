import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import Pane from "@/components/Pane";
import Window from "@/components/Window";
import FloSightShots from "@/components/demos/FloSightShots";
import SpotuiDemo from "@/components/demos/SpotuiDemo";
import TuChatDemo from "@/components/demos/TuChatDemo";
import { projects } from "@/data/projects";

const demos = {
  tuchat: { title: "tuchat (interactive demo)", Component: TuChatDemo },
  spotui: { title: "spotui (interactive demo)", Component: SpotuiDemo },
  flosight: { title: "flosightdrones.com", Component: FloSightShots },
};

const linkClass = "text-cyan underline underline-offset-4 hover:text-pink";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function findProject(slug) {
  return projects.find((project) => project.slug === slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = findProject(slug);

  return {
    title: project?.name,
    description: project?.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) notFound();

  const { name, file, summary, highlights, tech, live, source } = project;
  const { title, Component: Demo } = demos[slug];

  return (
    <div className="@container mx-auto max-w-6xl space-y-10 px-6 py-10">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-purple">{name}</h1>
        <p className="mt-4 text-lg leading-relaxed">{summary}</p>
        <ul
          aria-label="Technologies"
          className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-green"
        >
          {tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-5 font-mono text-sm">
          {live && (
            <a href={live} className={linkClass}>
              Live site
            </a>
          )}
          {source.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <Window title={title}>
        <Demo />
      </Window>

      <div className="grid items-start gap-6 @4xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Pane title={file}>
          <div className="buffer">
            {project.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-pink">
                  {section.title}
                </h2>
                <p className="mt-2 leading-relaxed">{section.text}</p>
                {section.code && (
                  <div className="mt-4">
                    <CodeBlock {...section.code} />
                  </div>
                )}
              </section>
            ))}
          </div>
        </Pane>

        <div className="grid gap-6">
          <Pane title="architecture">
            <ol className="font-mono text-sm">
              {project.flow.map((step) => (
                <li
                  key={step}
                  className="before:block before:text-center before:text-comment before:content-['↓'] first:before:hidden"
                >
                  <span className="block rounded border border-line bg-bg-dark px-3 py-2 text-center">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Pane>
          <Pane title="highlights">
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted marker:text-purple">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </Pane>
        </div>
      </div>
    </div>
  );
}
