import { roomNames } from "@/lib/tuchat";

// Draws TuChat's chat screen. The layout and colors come from the real client
// (client/tui/style.go), so they're hardcoded here instead of using the theme.

function Entry({ entry }) {
  const time = entry.time && (
    <span className="text-[#546377]">[{entry.time}] </span>
  );

  switch (entry.kind) {
    case "chat":
      return (
        <div className="flex">
          <span className="shrink-0 whitespace-pre">{time}</span>
          <span
            className={`mr-[1ch] min-w-[7ch] shrink-0 font-bold ${
              entry.self ? "text-[#4078c0]" : "text-[#6e5494]"
            }`}
          >
            {entry.nickname}
          </span>
          <span className="min-w-0 break-words">{entry.text}</span>
        </div>
      );

    case "pm":
      return (
        <div className="break-words">
          {time}
          <span className="text-[#72f478] italic">
            PM {entry.nickname} -&gt; {entry.target}
          </span>
          : {entry.text}
        </div>
      );

    case "error":
      return (
        <div className="font-bold break-words text-[#ef4444]">
          Error: {entry.text}
        </div>
      );

    default:
      return (
        <div className="break-words whitespace-pre-wrap text-[#546377]">
          {time}
          <span className="italic">{entry.text}</span>
        </div>
      );
  }
}

function TabLabel({ name, active, onSelect }) {
  const className = active ? "font-bold text-[#4078c0]" : "text-[#546377]";

  return onSelect ? (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`cursor-pointer ${className}`}
    >
      {name}
    </button>
  ) : (
    <span className={className}>{name}</span>
  );
}

function Users({ state }) {
  const room = state.rooms[state.room];

  return [state.nickname, ...room.users].map((name) => (
    <p key={name} className="truncate pl-[1ch]">
      • {name}
      {room.owned && name === state.nickname && " (owner)"}
    </p>
  ));
}

function Rooms({ state, onJoin }) {
  return roomNames(state).map((name) => {
    const room = state.rooms[name];
    const current = name === state.room;
    const selected = name === state.selectedRoom;
    const marker = current ? "✓" : selected ? ">" : " ";
    const count = room.users.length + (current ? 1 : 0);

    return (
      <button
        key={name}
        type="button"
        onClick={() => onJoin(name)}
        className={`block w-full cursor-pointer truncate text-left whitespace-pre ${
          selected ? "font-bold text-[#4078c0]" : "pl-[1ch]"
        }`}
      >
        {marker} {name} ({count}){room.password && "🔒"}
      </button>
    );
  });
}

// Without `onTab` and `onJoin` this renders as a still picture.
export default function TuChatView({
  state,
  onTab,
  onJoin,
  input,
  logProps,
  className = "h-72",
}) {
  const room = state.rooms[state.room];
  const title = `#${state.room}${room.topic ? ` - ${room.topic}` : ""}`;

  return (
    <div className="@container bg-[#191a21] p-3 font-mono text-[13px] leading-5 text-fg">
      <p className="mb-5 w-fit max-w-full bg-[#4078c0] px-[2ch] font-bold text-[#fff]">
        TuChat&nbsp; |&nbsp; {title} (localhost:8080)&nbsp; Users:{" "}
        {room.users.length + 1}
      </p>

      <div className="grid items-start gap-x-px gap-y-2 @lg:grid-cols-[minmax(0,1fr)_24ch]">
        <div
          {...logProps}
          className={`overflow-y-auto rounded-md border border-[#4078c0] px-[1ch] py-1 ${className}`}
        >
          {state.entries.map((entry, index) => (
            <Entry key={index} entry={entry} />
          ))}
        </div>

        <div className="rounded-md border border-[#546377] px-[1ch] py-1">
          <div className="mb-5 flex gap-[2ch]">
            <TabLabel
              name="USERS"
              active={state.tab === "users"}
              onSelect={onTab && (() => onTab("users"))}
            />
            <TabLabel
              name="ROOMS"
              active={state.tab === "rooms"}
              onSelect={onTab && (() => onTab("rooms"))}
            />
          </div>
          {state.tab === "users" ? (
            <Users state={state} />
          ) : (
            <Rooms state={state} onJoin={onJoin} />
          )}
          <div className="mt-5">
            {state.tab === "rooms" && (
              <>
                <p>Ctrl+J to join</p>
                <p>↑/↓ Select</p>
              </>
            )}
            <p>Tab to switch tabs</p>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-[#4078c0] px-[1ch] py-1">
          {input ?? (
            <p className="text-[#808080]">
              <span className="bg-fg text-bg motion-safe:animate-blink">m</span>
              essage or /command
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
