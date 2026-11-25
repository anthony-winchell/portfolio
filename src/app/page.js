import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const linkClass = "text-cyan underline underline-offset-4 hover:text-pink";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <section className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-green">{site.role}</p>
          <h1 className="mt-2 text-4xl font-bold text-purple">{site.name}</h1>
          <p className="mt-4 max-w-lg text-lg">
            I build backend systems and terminal tools in Go, and web apps with
            React and Next.js.
          </p>
          <div className="mt-6 flex flex-wrap gap-5 font-mono text-sm">
            <a href={site.github} className={linkClass}>
              GitHub
            </a>
            <a href={site.linkedin} className={linkClass}>
              LinkedIn
            </a>
            <a href={`mailto:${site.email}`} className={linkClass}>
              Email
            </a>
          </div>
        </div>
        <Image
          src="/me.jpeg"
          alt="Anthony Winchell"
          width={160}
          height={160}
          preload
          className="size-32 shrink-0 rounded-full border-2 border-purple object-cover sm:size-40"
        />
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-purple">Projects</h2>
        <div className="mt-6 space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              headingLevel="h3"
            />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-purple">About</h2>
        <p className="mt-4 text-lg leading-relaxed">
          I graduated with a computer science degree in July 2026. I like
          concurrency, networking, and building tools I want to use myself,
          mostly from inside Neovim.
        </p>
      </section>
    </div>
  );
}
