import Pane from "@/components/Pane";
import { site } from "@/data/site";

export const metadata = {
  title: "About",
  description:
    "Backend-focused software engineer in healthcare technology, with a particular interest in Go, networking, and developer tools.",
  alternates: { canonical: "/about" },
};

const linkClass = "text-cyan underline underline-offset-4 hover:text-pink";

const tools = [
  {
    label: "Usual stack",
    items: "Go, JavaScript, React, Next.js, Docker, SQLite, PostgreSQL",
  },
  { label: "Also used", items: "Angular, TypeScript, Spring Boot, ExpressJS" },
  { label: "OS", items: "Linux, MacOS, Windows (yuck)" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl px-6 py-10 lg:px-12">
      <Pane title="about.md">
        <div className="buffer">
          <section>
            <h1 className="text-4xl font-bold text-purple">About me</h1>
            <div className="mt-4 space-y-5 text-lg leading-relaxed">
              <p>
                I&apos;m a software engineer with a particular interest in
                backend development, systems programming, and understanding how
                software works at a low level.
              </p>
              <p>
                I earned my B.S. in Computer Science from Western Governors
                University in 1.5 years while working full-time, making the
                transition into tech after nearly a decade in the service
                industry.
              </p>
              <p>
                Today, I work in healthcare technology, where my
                responsibilities span software development, infrastructure,
                automation, AI integration, and IT support.
              </p>
              <p>
                Most of my personal development work revolves around Go. I
                appreciate its simplicity, straightforward tooling, and emphasis
                on writing clear, maintainable code. I&apos;m especially
                interested in networking, APIs, developer tools, and the systems
                that make software reliable.
              </p>
              <p>
                Outside of work, I&apos;m usually working on a side project,
                reading, or exploring something I&apos;ve been curious about. I
                enjoy the process of figuring out how things work, and I&apos;m
                always looking for an opportunity to learn something new.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pink">Tools</h2>
            <dl className="mt-3 space-y-3">
              {tools.map((tool) => (
                <div key={tool.label}>
                  <dt className="font-mono text-sm text-cyan">{tool.label}</dt>
                  <dd>{tool.items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pink">Contact</h2>
            <div className="mt-3 flex flex-wrap gap-5 font-mono text-sm">
              <a href={`mailto:${site.email}`} className={linkClass}>
                Email
              </a>
              <a href={site.linkedin} className={linkClass}>
                LinkedIn
              </a>
              <a href={site.github} className={linkClass}>
                GitHub
              </a>
              {site.resume && (
                <a href={site.resume} className={linkClass}>
                  Resume
                </a>
              )}
            </div>
          </section>
        </div>
      </Pane>
    </div>
  );
}
