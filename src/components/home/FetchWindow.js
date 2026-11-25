import Image from "next/image";
import Window from "@/components/Window";

const facts = [
  { label: "role", value: "Software Engineer" },
  { label: "focus", value: "Backend" },
  { label: "langs", value: "Go, JavaScript" },
  { label: "web", value: "React, Next.js" },
  { label: "degree", value: "CS, July 2026" },
];

const palette = [
  "bg-red",
  "bg-orange",
  "bg-yellow",
  "bg-green",
  "bg-cyan",
  "bg-purple",
  "bg-pink",
];

export default function FetchWindow() {
  return (
    <Window title="~ fetch">
      <div className="flex flex-col gap-6 p-6 font-mono text-sm @md:flex-row @md:items-center">
        <Image
          src="/me.jpeg"
          alt="Anthony Winchell"
          width={176}
          height={176}
          preload
          className="size-36 shrink-0 rounded-lg border border-line object-cover"
        />
        <div className="min-w-0">
          <p className="font-bold">
            <span className="text-purple">anthony</span>
            <span className="text-muted">@</span>
            <span className="text-pink">portfolio</span>
          </p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-cyan">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div aria-hidden="true" className="mt-4 flex">
            {palette.map((color) => (
              <span key={color} className={`h-4 w-6 ${color}`} />
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}
