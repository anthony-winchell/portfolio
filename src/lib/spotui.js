// The spotui demo's state and key bindings, following the real app. The
// playlists are made up, and nothing is actually played.

export const sections = [
  "Now Playing",
  "Playlists",
  "Liked Songs",
  "Recently Played",
  "Search",
];

const SEARCH = sections.indexOf("Search");

function track(name, artist, album, seconds) {
  return { name, artist, album, seconds };
}

const tracks = [
  track("Playing God", "Polyphia", "Remember That You Will Die", 206),
  track("Electric Sunrise", "Plini", "Handmade Cities", 305),
  track("Touch and Go", "Intervals", "The Way Forward", 262),
  track("G.O.A.T.", "Polyphia", "New Levels New Devils", 216),
  track("Epiphany", "Intervals", "In Time - EP", 358),
  track("Handmade Cities", "Plini", "Handmade Cities", 285),
];

const playlists = [
  { name: "Deep Focus Compile", start: 1 },
  { name: "Friday Deploys", start: 5 },
  { name: "Rubber Duck Radio", start: 4 },
];

export function trackLabel({ name, artist }) {
  return `${name} — ${artist}`;
}

// Search results list tracks, then artists, then albums.
function search(query) {
  const matches = (text) => text.toLowerCase().includes(query.toLowerCase());
  const unique = (key) => [...new Set(tracks.map((item) => item[key]))];
  const firstWith = (key, value) =>
    tracks.findIndex((item) => item[key] === value);

  return [
    ...tracks
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => matches(trackLabel(item)))
      .map(({ item, index }) => ({
        kind: "track",
        label: trackLabel(item),
        track: index,
      })),
    ...unique("artist")
      .filter(matches)
      .map((artist) => ({
        kind: "artist",
        label: artist,
        track: firstWith("artist", artist),
      })),
    ...unique("album")
      .filter(matches)
      .map((album) => {
        const index = firstWith("album", album);
        return {
          kind: "album",
          label: `${album} — ${tracks[index].artist}`,
          track: index,
        };
      }),
  ];
}

export const initialState = {
  running: true,
  section: 0,
  focus: "sidebar",
  cursors: [0, 0, 0, 0, 0],
  track: 0,
  progress: 107,
  playing: true,
  shuffle: false,
  repeat: "off",
  volume: 65,
  searching: false,
  query: "",
  results: [],
};

export function currentTrack(state) {
  return tracks[state.track];
}

// The rows in the active section's list, each with the track it would play.
export function rows(state) {
  switch (sections[state.section]) {
    case "Playlists":
      return playlists.map(({ name, start }) => ({ label: name, track: start }));
    case "Liked Songs":
      return tracks.map((item, index) => ({
        label: trackLabel(item),
        track: index,
      }));
    case "Recently Played":
      return [
        { label: `Wed 14:02 ${trackLabel(tracks[2])}`, track: 2 },
        { label: `Wed 13:58 ${trackLabel(tracks[5])}`, track: 5 },
        { label: `Wed 13:54 ${trackLabel(tracks[1])}`, track: 1 },
      ];
    case "Search":
      return state.results.map((result) => ({
        label: `${result.kind.padEnd(6)} ${result.label}`,
        track: result.track,
      }));
    default:
      return [];
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function play(state, index) {
  return { ...state, track: index, progress: 0, playing: true };
}

function skip(state, delta) {
  const step = state.shuffle ? delta * 2 + 1 : delta;
  return {
    ...state,
    track: (state.track + step + tracks.length) % tracks.length,
    progress: 0,
  };
}

function seek(state, delta) {
  const { seconds } = currentTrack(state);
  return { ...state, progress: clamp(state.progress + delta, 0, seconds) };
}

function setVolume(state, delta) {
  return { ...state, volume: clamp(state.volume + delta, 0, 100) };
}

function startSearch(state) {
  return { ...state, section: SEARCH, focus: "main", searching: true };
}

function enterMain(state) {
  return state.section === SEARCH
    ? startSearch(state)
    : { ...state, focus: "main" };
}

function move(state, delta) {
  if (state.focus === "sidebar") {
    return {
      ...state,
      section: clamp(state.section + delta, 0, sections.length - 1),
    };
  }

  const last = Math.max(0, rows(state).length - 1);
  return {
    ...state,
    cursors: state.cursors.map((cursor, index) =>
      index === state.section ? clamp(cursor + delta, 0, last) : cursor,
    ),
  };
}

function playSelected(state) {
  const row = rows(state)[state.cursors[state.section]];
  return row ? play(state, row.track) : state;
}

const nextRepeat = { off: "context", context: "track", track: "off" };

// Each key maps to a function from the old state to the new one.
const keys = {
  " ": (state) => ({ ...state, playing: !state.playing }),
  n: (state) => skip(state, 1),
  N: (state) => skip(state, -1),
  "-": (state) => setVolume(state, -5),
  "+": (state) => setVolume(state, 5),
  "=": (state) => setVolume(state, 5),
  ",": (state) => seek(state, -5),
  ".": (state) => seek(state, 5),
  s: (state) => ({ ...state, shuffle: !state.shuffle }),
  r: (state) => ({ ...state, repeat: nextRepeat[state.repeat] }),
  h: (state) => ({ ...state, focus: "sidebar" }),
  Escape: (state) => ({ ...state, focus: "sidebar" }),
  l: enterMain,
  "/": startSearch,
  j: (state) => move(state, 1),
  k: (state) => move(state, -1),
  Enter: (state) =>
    state.focus === "sidebar" ? enterMain(state) : playSelected(state),
  q: (state) => ({ ...state, running: false }),
};

export function handlesKey(key) {
  return Object.hasOwn(keys, key);
}

export function reducer(state, action) {
  switch (action.type) {
    case "key":
      return state.running && handlesKey(action.key)
        ? keys[action.key](state)
        : state;

    case "tick": {
      if (!state.running || !state.playing) return state;
      const { seconds } = currentTrack(state);
      if (state.progress + 1 <= seconds) {
        return { ...state, progress: state.progress + 1 };
      }
      return state.repeat === "track"
        ? { ...state, progress: 0 }
        : skip(state, 1);
    }

    case "section":
      return action.section === SEARCH
        ? startSearch(state)
        : {
            ...state,
            section: action.section,
            focus: "sidebar",
            searching: false,
          };

    case "select":
      return playSelected({
        ...state,
        focus: "main",
        cursors: state.cursors.map((cursor, index) =>
          index === state.section ? action.index : cursor,
        ),
      });

    case "search": {
      const query = action.query.trim();
      if (!query) return { ...state, searching: false };
      return {
        ...state,
        searching: false,
        query,
        results: search(query),
        cursors: state.cursors.map((cursor, index) =>
          index === SEARCH ? 0 : cursor,
        ),
      };
    }

    case "cancelSearch":
      return { ...state, searching: false };

    case "restart":
      return initialState;

    default:
      return state;
  }
}

export function mmss(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
