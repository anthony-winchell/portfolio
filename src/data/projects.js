export const projects = [
  {
    slug: "tuchat",
    name: "TuChat",
    summary:
      "A self-hosted chat server and terminal chat in Go, with accounts and rooms over JSON protocol on raw TCP.",
    highlights: [
      "A bounded outbox per client, so one slow connection can't block a room",
      "Bcrypt-hashed accounts and password-protected rooms",
      "Dockerized server with graceful shutdown",
    ],
    tech: ["Go", "TCP", "Bubble Tea", "Docker"],
    source: [
      { label: "Source", href: "https://github.com/anthony-winchell/TuChat" },
    ],
  },

  {
    slug: "spotui",
    name: "spotui",
    summary:
      "A Spotify client for the terminal, with playback controls, search, playlists, a Now Playing view and a cooresponding NeoVim plugin.",
    highlights: [
      "OAuth login using PKCE, with no client secret",
      "Login tokens stored in the operating system's keyring",
      "Debounced input and backoff that honors Spotify's rate limits",
      "Vim-style keyboard controls",
    ],
    tech: ["Go", "Bubble Tea", "OAuth 2.0", "Spotify API"],
    source: [
      { label: "Source", href: "https://github.com/anthony-winchell/spotui" },
    ],
  },

  {
    slug: "flosight",
    name: "FloSight Droneworks",
    summary:
      "Marketing site and lead management dashboard for a drone services business in Central Florida.",
    highlights: [
      "Private dashboard for reviewing leads and tracking their status",
      "Spring Boot API with JWT authentication and PostgreSQL",
      "Next.js front end with validated forms",
    ],
    tech: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL"],
    live: "https://www.flosightdrones.com/",
    source: [
      {
        label: "Frontend",
        href: "https://github.com/anthony-winchell/flosight-next",
      },
      {
        label: "Backend",
        href: "https://github.com/anthony-winchell/flosight-spring",
      },
    ],
  },
];
