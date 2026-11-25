import Window from "@/components/Window";
import { career } from "@/data/career";

// The graph has two lanes: main on the left and the wgu branch on the right.
// Lines that stretch with the text are divs, and the two curves are SVGs.

function Line({ lane, className }) {
  return (
    <span
      className={`absolute w-0.5 ${
        lane === "main" ? "left-[7px] bg-purple" : "left-[31px] bg-green"
      } ${className}`}
    />
  );
}

function Dot({ lane }) {
  return (
    <span
      className={`absolute top-1.5 size-4 rounded-full border-2 bg-bg-dark ${
        lane === "main" ? "left-0 border-purple" : "left-6 border-green"
      }`}
    />
  );
}

function Curve({ path, className }) {
  return (
    <svg
      width="40"
      height="28"
      viewBox="0 0 40 28"
      fill="none"
      stroke="var(--color-green)"
      strokeWidth="2"
      className={`absolute left-0 ${className}`}
    >
      <path d={path} />
    </svg>
  );
}

const graphs = {
  // The newest commit: main starts here and runs down.
  tip: (
    <>
      <Line lane="main" className="top-3.5 bottom-0" />
      <Dot lane="main" />
    </>
  ),
  // Main continues, and the branch curves away to the right.
  merge: (
    <>
      <Line lane="main" className="inset-y-0" />
      <Curve path="M8 0C8 18 32 10 32 28" className="top-3.5" />
      <Line lane="wgu" className="top-[42px] bottom-0" />
      <Dot lane="main" />
    </>
  ),
  // A commit on the branch, with main running beside it.
  branch: (
    <>
      <Line lane="main" className="inset-y-0" />
      <Line lane="wgu" className="inset-y-0" />
      <Dot lane="wgu" />
    </>
  ),
  // The first commit: the branch curves back into main.
  root: (
    <>
      <Line lane="main" className="top-0 h-3.5" />
      <Curve path="M32 0C32 12 24 14 8 14" className="top-0" />
      <Dot lane="main" />
    </>
  ),
};

export default function CareerLog() {
  return (
    <Window title="~ git log --graph career">
      <ol className="p-5 sm:p-6">
        {career.map((entry) => (
          <li key={entry.hash} className="relative pb-8 pl-14 last:pb-0">
            <div aria-hidden="true" className="absolute inset-y-0 left-0">
              {graphs[entry.graph]}
            </div>

            <p
              aria-hidden="true"
              className="flex flex-wrap gap-x-3 font-mono text-sm leading-7"
            >
              <span className="text-yellow">{entry.hash}</span>
              {entry.ref && <span className="text-cyan">({entry.ref})</span>}
            </p>
            <h3 className="text-lg font-bold">{entry.title}</h3>
            <p className="mt-1 font-mono text-sm text-green">{entry.when}</p>
            {entry.details.map((detail) => (
              <p key={detail} className="mt-2 max-w-2xl text-muted">
                {detail}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </Window>
  );
}
