import { currentTrack, mmss, rows, sections } from "@/lib/spotui";

// Draws spotui's screen, following internal/ui/view.go. The real app uses
// Dracula too, so these are the site's own theme colors.

function Bar({ state }) {
  const { seconds } = currentTrack(state);

  return (
    <div className="flex items-center gap-[1ch]">
      <div className="relative h-px flex-1 bg-comment">
        <div
          className="absolute -top-px left-0 h-[3px] bg-purple"
          style={{ width: `${(state.progress / seconds) * 100}%` }}
        />
      </div>
      <span className="shrink-0">
        {mmss(state.progress)} / {mmss(seconds)}
      </span>
    </div>
  );
}

function Modes({ state }) {
  const on = "text-green";
  const off = "text-comment";

  return (
    <>
      <span className={state.shuffle ? on : off}>shuffle</span>
      <span className={off}> • </span>
      <span className={state.repeat === "off" ? off : on}>
        {state.repeat === "track" ? "repeat one" : "repeat"}
      </span>
    </>
  );
}

function NowPlaying({ state }) {
  const track = currentTrack(state);

  return (
    <div className="flex gap-[2ch]">
      <div className="hidden h-60 w-[26ch] shrink-0 place-items-center rounded-md border border-comment text-comment @xl:grid">
        ♪
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{track.name}</p>
        <p className="truncate text-cyan">{track.artist}</p>
        <p className="truncate text-comment">{track.album}</p>
        <div className="my-5">
          <Bar state={state} />
        </div>
        <p className={state.playing ? "text-green" : "text-comment"}>
          {state.playing ? "▶ Playing" : "⏸ Paused"}
        </p>
        <p className="text-comment">
          on Desktop (Computer) • vol {state.volume}%
        </p>
        <p>
          <Modes state={state} />
        </p>
      </div>
    </div>
  );
}

function List({ state, onSelect }) {
  const items = rows(state);
  if (items.length === 0) return <p className="text-comment">Nothing here.</p>;

  return items.map((item, index) => {
    const selected = index === state.cursors[state.section];

    return (
      <button
        key={item.label}
        type="button"
        tabIndex={-1}
        onClick={() => onSelect?.(index)}
        className={`block w-full cursor-pointer truncate text-left whitespace-pre ${
          selected ? "font-bold text-purple" : ""
        }`}
      >
        {selected ? "> " : " "}
        {item.label}
      </button>
    );
  });
}

// Without handlers this renders as a still picture.
export default function SpotuiView({
  state,
  onSection,
  onSelect,
  searchInput,
  className = "@md:h-80",
}) {
  const section = sections[state.section];
  const track = currentTrack(state);
  const panel = "rounded-md border px-[1ch] py-0.5";
  const focused = (name) =>
    state.focus === name ? "border-purple" : "border-comment";

  return (
    <div className="@container bg-bg p-3 font-mono text-[13px] leading-5 text-fg">
      <div
        className={`grid gap-px @md:grid-cols-[22ch_minmax(0,1fr)] ${className}`}
      >
        <div className={`${panel} ${focused("sidebar")}`}>
          {sections.map((name, index) => {
            const active = index === state.section;
            const props = {
              className: `block w-full whitespace-pre text-left ${
                active ? "font-bold text-purple" : ""
              }`,
              children: `${active ? "> " : " "}${name}`,
            };

            return onSection ? (
              <button
                key={name}
                type="button"
                tabIndex={-1}
                data-opens-search={name === "Search" ? "" : undefined}
                onClick={() => onSection(index)}
                {...props}
                className={`cursor-pointer ${props.className}`}
              />
            ) : (
              <span key={name} {...props} />
            );
          })}
        </div>

        <div
          className={`min-h-64 overflow-hidden ${panel} ${focused("main")}`}
        >
          <p className="mb-5 font-bold">{section}</p>
          {section === "Now Playing" && <NowPlaying state={state} />}
          {section === "Search" && (
            <>
              <div className="mb-5">{searchInput}</div>
              {state.query === "" && (
                <p className="text-comment">Press / to input. Enter to search</p>
              )}
            </>
          )}
          {section !== "Now Playing" &&
            (section !== "Search" || state.query !== "") && (
              <List state={state} onSelect={onSelect} />
            )}
        </div>
      </div>

      <div className={`mt-px border-comment ${panel}`}>
        <p className="truncate">
          {state.playing ? <span className="text-green">▶</span> : "⏸"}{" "}
          <span className="font-bold">{track.name}</span>
        </p>
        <p className="truncate text-cyan">{track.artist}</p>
        <Bar state={state} />
        <p className="truncate">
          <span className="text-comment">
            Desktop • vol {state.volume}% •{" "}
          </span>
          <Modes state={state} />
        </p>
      </div>

      <p className="truncate text-comment">
        {state.searching
          ? "enter search • esc cancel"
          : "/ search • h/l panels • j/k move • enter play • space play/pause • n next • N prev • ,/. seek • +/- vol • s shuffle • r repeat • q quit"}
      </p>
    </div>
  );
}
