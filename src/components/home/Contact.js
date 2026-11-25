import { site } from "@/data/site";

const linkClass =
  "rounded border border-line px-4 py-2 hover:border-cyan hover:text-cyan";

export default function Contact() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-purple">Get in touch</h2>
      <p className="mt-4 text-lg leading-relaxed">
        I&apos;m open to new backend roles, preferably in Go. If you&apos;re
        hiring, or want to talk about something I&apos;ve built, send me a
        message.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
        <a
          href={`mailto:${site.email}`}
          className="rounded border border-purple bg-purple px-4 py-2 font-bold text-bg-dark hover:border-pink hover:bg-pink"
        >
          Email me
        </a>
        {site.resume && (
          <a href={site.resume} className={linkClass}>
            Resume
          </a>
        )}
        <a href={site.linkedin} className={linkClass}>
          LinkedIn
        </a>
        <a href={site.github} className={linkClass}>
          GitHub
        </a>
      </div>
    </div>
  );
}
