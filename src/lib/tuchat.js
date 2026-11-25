// The TuChat demo's state and rules. Messages and errors are copied from the
// real server, but nothing here talks to a network.

const ADDRESS = "localhost:8080";

export const ROOM_PASSWORD = "demo";

const helpEntries = [
  ["/clear", "Clears your screen", "/clear"],
  ["/help", "Lists all commands", "/help"],
  [
    "/history",
    "Lists the last N messages in the room",
    "/history [positive number] (default: 20)",
  ],
  ["/join", "Joins a room", "/join <room> [password]"],
  ["/leave", "Leaves the current room", "/leave"],
  ["/nick", "Change your nickname", "/nick <nickname>"],
  [
    "/pm",
    "Send a private message to a user",
    "/pm <nickname> <message>",
  ],
  ["/quit", "Disconnects from the server", "/quit"],
  ["/serverinfo", "Lists basic server information", "/serverinfo"],
  ["/settopic", "Sets the room topic (admin only)", "/settopic <topic>"],
  ["/topic", "Current room topic", "/topic"],
];

// Real commands that this demo doesn't simulate.
const unsupported = [
  "/addadmin",
  "/announce",
  "/delete",
  "/kick",
  "/removeadmin",
  "/rename",
  "/room",
  "/rooms",
  "/serverrename",
  "/setpassword",
  "/setserverpassword",
  "/setwelcome",
  "/users",
];

const system = (text, time) => ({ kind: "system", text, time });
const error = (text) => ({ kind: "error", text });
const chat = (nickname, text, time) => ({
  kind: "chat",
  nickname,
  text,
  time,
});

export const initialState = {
  connected: true,
  nickname: "guest",
  room: "general",
  tab: "users",
  selectedRoom: "general",
  awaitingPassword: null,
  rooms: {
    general: { topic: "", users: ["anthony", "ethan", "lucas"] },
    golang: { topic: "channels and such", users: ["ethan"] },
    ops: { topic: "", users: ["anthony"], password: ROOM_PASSWORD },
  },
  logs: {
    general: [
      chat("ethan", "pushed the reconnect fix"),
      chat("anthony", "nice, pulling it now"),
      chat("lucas", "is general slow for anyone else?"),
      chat("ethan", "that was the load test, done now"),
    ],
    golang: [chat("ethan", "select with a default case is doing a lot here")],
    ops: [chat("anthony", "you found the locked room")],
  },
  entries: [
    system("Joined room: general", "14:02"),
    {
      kind: "welcome",
      text: `Welcome to TuChat, guest!\n\nType /help for commands.\n\nServer Address: ${ADDRESS}`,
      time: "14:02",
    },
    chat("ethan", "pushed the reconnect fix", "14:02"),
    chat("anthony", "nice, pulling it now", "14:03"),
    chat("lucas", "is general slow for anyone else?", "14:05"),
    chat("ethan", "that was the load test, done now", "14:05"),
  ],
};

// The server lists rooms by name.
export function roomNames(state) {
  return Object.keys(state.rooms).sort();
}

function say(state, ...entries) {
  return { ...state, entries: [...state.entries, ...entries] };
}

function validateRoomName(name) {
  if (name.length < 2 || name.length > 50) {
    return "room name must be between 2 and 50 characters long";
  }
  if (name.includes("/")) return "room name cannot contain forward slashes";
  if (name.includes("\\")) return "room name cannot contain back slashes";
  if (name.includes(".")) return "room name cannot contain periods";
  if (/[#!@$%^&*()[\]{}|;:,<>?~`]/.test(name)) {
    return "room name cannot contain special characters";
  }
  return null;
}

function validateNickname(name) {
  if (name.length < 3 || name.length > 13) {
    return "nickname must be between 3 and 13 characters long";
  }
  if (name.includes(":")) return "nickname cannot contain ':'";
  return null;
}

function askForPassword(state, name) {
  return say(
    { ...state, awaitingPassword: name },
    system(`#${name} requires a password. Enter it or press Esc to cancel.`),
  );
}

function join(state, name, password, time) {
  const exists = Object.hasOwn(state.rooms, name);
  const invalid = exists ? null : validateRoomName(name);
  if (invalid) return say(state, error(invalid));
  if (name === state.room) return say(state, error("already in room"));

  const room = exists
    ? state.rooms[name]
    : { topic: "", users: [], owned: true };

  if (room.password && room.password !== password) {
    return askForPassword(state, name);
  }

  return {
    ...state,
    room: name,
    awaitingPassword: null,
    rooms: { ...state.rooms, [name]: room },
    logs: { ...state.logs, [name]: state.logs[name] ?? [] },
    // The client clears the screen when it joins a room.
    entries: [system(`Joined room: ${name}`, time)],
  };
}

function everyone(state) {
  return [...new Set(Object.values(state.rooms).flatMap((r) => r.users))];
}

function findUser(state, name) {
  return everyone(state).find(
    (user) => user.toLowerCase() === name.toLowerCase(),
  );
}

function runCommand(state, input, time) {
  const [command, ...args] = input.split(/\s+/);
  const room = state.rooms[state.room];

  switch (command) {
    case "/clear":
      return {
        ...state,
        entries: [system("Cleared chat history. Use /history to recover.")],
      };

    case "/help":
      return say(
        state,
        system(
          "Commands:\n\n" +
            helpEntries
              .map(([name, text, usage]) => `${name} - ${text}\n  Usage: ${usage}`)
              .join("\n\n"),
        ),
      );

    case "/join":
      if (args.length < 1) {
        return say(state, error("Usage: /join <room> [password]"));
      }
      return join(state, args[0], args.slice(1).join(" "), time);

    case "/leave":
      return state.room === "general"
        ? state
        : join(state, "general", "", time);

    case "/nick": {
      if (args.length < 1) return say(state, error("Usage: /nick <nickname>"));
      if (args.length > 1) {
        return say(state, error("Nickname cannot contain spaces"));
      }
      const invalid = validateNickname(args[0]);
      if (invalid) return say(state, error(invalid));
      if (findUser(state, args[0])) return say(state, error("nickname taken"));

      return say(
        { ...state, nickname: args[0] },
        system(`${state.nickname} changed their nickname to ${args[0]}`),
      );
    }

    case "/pm": {
      if (args.length < 2) {
        return say(state, error("Usage: /pm <nickname> <message>"));
      }
      if (args[0].toLowerCase() === state.nickname.toLowerCase()) {
        return say(state, error("You cannot PM yourself"));
      }
      const target = findUser(state, args[0]);
      if (!target) return say(state, error(`User not found: ${args[0]}`));

      return say(state, {
        kind: "pm",
        nickname: state.nickname,
        target,
        text: args.slice(1).join(" "),
        time,
      });
    }

    case "/topic":
      return say(
        state,
        system(room.topic ? `Topic: ${room.topic}` : "No topic set", time),
      );

    case "/settopic": {
      if (args.length < 1) {
        return say(state, error("Usage: /settopic <topic>"));
      }
      if (state.room === "general") {
        return say(
          state,
          error("general is the default room and cannot be modified"),
        );
      }
      if (!room.owned) return say(state, error("admin permissions required"));

      const topic = args.join(" ");
      return say(
        {
          ...state,
          rooms: { ...state.rooms, [state.room]: { ...room, topic } },
        },
        system(`${state.nickname} changed the topic to: ${topic}`, time),
      );
    }

    case "/history": {
      const count = args.length ? Number(args[0]) : 20;
      if (!Number.isInteger(count) || count <= 0) {
        return say(
          state,
          error("Usage: /history [positive number] (default: 20)"),
        );
      }
      if (count > 300) {
        return say(state, error("History limit is 300 messages"));
      }
      return say(
        state,
        ...state.logs[state.room]
          .slice(-count)
          .map((entry) => system(`${entry.nickname}: ${entry.text}`)),
      );
    }

    case "/serverinfo":
      return say(
        state,
        system("Server: TuChat"),
        system("Uptime: 2h14m6s"),
        system(`Rooms: ${Object.keys(state.rooms).length}`),
        system(`Users: ${everyone(state).length + 1}`),
        system(`Server Address: ${ADDRESS}`),
      );

    case "/quit":
      return { ...state, connected: false };

    default:
      return unsupported.includes(command)
        ? say(
            state,
            system(`(${command} is a real command, but not part of this demo)`),
          )
        : say(state, error(`Unknown command: ${command}`));
  }
}

function post(state, roomName, entry) {
  const next = {
    ...state,
    logs: {
      ...state.logs,
      [roomName]: [...(state.logs[roomName] ?? []), entry],
    },
  };
  return roomName === state.room ? say(next, entry) : next;
}

export function reducer(state, action) {
  switch (action.type) {
    case "submit": {
      const text = action.text.trim();
      if (!text || !state.connected) return state;
      if (text.startsWith("/")) return runCommand(state, text, action.time);
      return post(state, state.room, {
        ...chat(state.nickname, text, action.time),
        self: true,
      });
    }

    case "remote":
      return state.connected
        ? post(
            state,
            action.room,
            chat(action.nickname, action.text, action.time),
          )
        : state;

    case "password":
      return action.value.trim()
        ? join(
            { ...state, awaitingPassword: null },
            state.awaitingPassword,
            action.value.trim(),
            action.time,
          )
        : state;

    case "cancelPassword":
      return say(
        { ...state, awaitingPassword: null },
        system("Cancelled join."),
      );

    case "join":
      if (action.room === state.room) return state;
      return state.rooms[action.room].password
        ? askForPassword(state, action.room)
        : join(state, action.room, "", action.time);

    case "moveRoom": {
      const names = roomNames(state);
      const index = names.indexOf(state.selectedRoom) + action.delta;
      const bounded = Math.max(0, Math.min(names.length - 1, index));
      return { ...state, selectedRoom: names[bounded] };
    }

    case "tab":
      return { ...state, tab: action.tab };

    case "reset":
      return initialState;

    default:
      return state;
  }
}
