import CareerLog from "@/components/home/CareerLog";
import Contact from "@/components/home/Contact";
import DashboardMenu from "@/components/home/DashboardMenu";
import FetchWindow from "@/components/home/FetchWindow";
import PixelName from "@/components/home/PixelName";
import ProjectWindow from "@/components/home/ProjectWindow";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata = {
  alternates: { canonical: "/" },
};

const linkClass = "text-cyan underline underline-offset-4 hover:text-pink";

export default function Home() {
  return (
    <div className="@container">
      <section className="bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 bg-radial from-bg from-40% to-transparent px-6 py-14 @5xl:grid-cols-2 @5xl:py-20">
          <div className="min-w-0">
            <h1 className="sr-only">{site.name}</h1>
            <PixelName />
            <p className="mt-8 max-w-lg text-lg leading-relaxed">
              I&apos;m a backend-focused software engineer in healthcare tech. I
              spent nearly a decade in the service industry, then earned a CS
              degree in 18 months while working full-time. I spend my own time
              building networking and terminal tools in Go.
            </p>
            <div className="mt-5 flex flex-wrap gap-5 font-mono text-sm">
              <a href={site.github} className={linkClass}>
                GitHub
              </a>
              <a href={site.linkedin} className={linkClass}>
                LinkedIn
              </a>
              <a href={`mailto:${site.email}`} className={linkClass}>
                Email
              </a>
              {site.resume && (
                <a href={site.resume} className={linkClass}>
                  Resume
                </a>
              )}
            </div>
          </div>

          <div className="@container min-w-0 space-y-6">
            <FetchWindow />
            <DashboardMenu />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-8 text-2xl font-bold text-purple">Experience</h2>
          <CareerLog />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold text-purple">Projects</h2>
          <div className="mt-8 space-y-16">
            {projects.map((project, index) => (
              <ProjectWindow
                key={project.slug}
                project={project}
                flipped={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <Contact />
        </div>
      </section>
    </div>
  );
}
