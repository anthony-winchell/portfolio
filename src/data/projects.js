// `highlights` is the short version, `sections` is the write-up on the project
// page, and `flow` is the architecture list beside it.

export const projects = [
  {
    slug: "tuchat",
    file: "tuchat.go",
    name: "TuChat",
    summary:
      "A self-hosted chat server and terminal client in Go, with accounts and rooms over a JSON protocol on raw TCP.",
    highlights: [
      "A bounded outbox per client, so one slow connection can't block a room",
      "Bcrypt-hashed accounts and password-protected rooms",
      "Dockerized server with graceful shutdown",
    ],
    tech: ["Go", "TCP", "Bubble Tea", "Docker"],
    source: [
      { label: "Source", href: "https://github.com/anthony-winchell/TuChat" },
    ],
    flow: [
      "Bubble Tea client",
      "JSON over TCP",
      "Connection goroutine",
      "Room broadcast",
      "Per-client outbox",
      "Writer goroutine",
    ],
    sections: [
      {
        title: "How it works",
        text: "The server accepts raw TCP connections and exchanges newline-delimited JSON. The terminal client is a Bubble Tea program, and both sides import the same protocol package, so there is one definition of a message.",
      },
      {
        title: "A slow client can't stall a room",
        text: "Each connection has its own writer goroutine, fed by a channel that holds 64 messages. Send never blocks: if a client's outbox is full, the server disconnects that client instead of making everyone else wait.",
        code: {
          file: "server/clients.go",
          text: `func (c *Client) Send(msg protocol.Message) error {
	select {
	case <-c.done:
		return errors.New("connection closed")

	default:
	}
	select {
	case c.outbox <- msg:
		return nil

	default:
		go c.stop()
		return errors.New("outbox full; client evicted")
	}
}`,
        },
      },
      {
        title: "Short-lived locks",
        text: "The server, each room, and each user guard their own state with a mutex. A broadcast copies the member list under a read lock and releases it before sending, so the room isn't locked while messages are being queued.",
      },
      {
        title: "Accounts and rooms",
        text: "Account and room passwords are hashed with bcrypt. Logging in allows three attempts within two minutes. Whoever creates a room owns it, and can set a password or promote admins, who can set the topic and kick people.",
      },
      {
        title: "Restarts and shutdown",
        text: "Settings are written to a temporary file and renamed into place, so an interrupted write doesn't leave a half-written config. Each room keeps an append-only log that /history reads back. On shutdown the server stops accepting connections, tells everyone, and waits for its goroutines to finish.",
      },
    ],
  },

  {
    slug: "spotui",
    file: "spotui.go",
    name: "spotui",
    summary:
      "A Spotify terminal client with playback controls, search, playlists and a Now Playing view.",
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
    flow: [
      "Key press",
      "Local state changes",
      "Debounce (300ms)",
      "Spotify Web API",
      "Playback sync (5s)",
      "Reconcile",
    ],
    sections: [
      {
        title: "Responsive over a slow API",
        text: "Volume, seek, shuffle, and repeat change on screen right away, and the request goes out once the key has been idle for 300ms. Each press gets a sequence number, so only the latest one is sent.",
      },
      {
        title: "Reconciling with Spotify",
        text: "Spotify can take a moment to report a change it has already accepted. While a change is pending, the local value wins over the fetched one, until Spotify catches up or five seconds pass. Without that, controls would flicker back to their old value.",
        code: {
          file: "internal/ui/update.go",
          text: `// reconcileValue keeps our pending value until Spotify reports the same one
func reconcileValue[T comparable](p *pending, now time.Time, ours T, theirs *T) {
	if !p.active(now) {
		return
	}

	if *theirs == ours {
		p.confirm() // Spotify caught up
		return
	}

	*theirs = ours // not yet; keep ours
}`,
        },
      },
      {
        title: "Login without a secret",
        text: "Login uses the OAuth authorization code flow with PKCE. A short-lived server on 127.0.0.1 receives the redirect and checks its state value. The refresh token goes in the operating system's credential store, and access tokens are renewed a minute before they expire.",
      },
      {
        title: "Polling politely",
        text: "Playback is fetched every five seconds and progress is estimated in between, so the bar moves every second without a request. When Spotify rate-limits a request, the next sync waits for the Retry-After it sent.",
      },
      {
        title: "One list, many types",
        text: "Playlists, liked songs, recent plays, and search results share one generic list type that handles loading, errors, the cursor, and scrolling.",
      },
    ],
  },

  {
    slug: "flosight",
    file: "flosight.tsx",
    name: "FloSight Drones",
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
    flow: [
      "Consultation form",
      "Zod validation",
      "Spring Boot API",
      "Email notification",
      "PostgreSQL",
      "Admin dashboard",
    ],
    sections: [
      {
        title: "From visitor to lead",
        text: "The consultation form is validated in the browser with React Hook Form and Zod, then again by the API. A valid request emails the business and is saved as a new lead.",
      },
      {
        title: "The dashboard",
        text: "Leads are listed newest first and can be filtered by status. Each one can be opened for its full details, moved from new through contacted, in progress, completed, and archived, or deleted.",
      },
      {
        title: "Access control",
        text: "The API is stateless. Submitting a lead is public, everything under /api/admin needs a valid JWT, and passwords are hashed with BCrypt. Cross-origin requests are only allowed from the front end.",
        code: {
          file: "config/SecurityConfig.java",
          text: `.authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/leads/**").permitAll()
        .requestMatchers("/api/admin/**").authenticated()
        .anyRequest().authenticated())`,
        },
      },
      {
        title: "Hosting",
        text: "The front end runs on Vercel. The API's Fly.io configuration lets it stop when idle and start on the next request, so the form tells visitors that sending may take a moment.",
      },
    ],
  },
];
