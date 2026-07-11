export type ProjectMetric = {
  label: string;
  value: string;
};

export type ProjectContentCard = {
  title: string;
  body: string;
};

export type ProjectFeatureCard = ProjectContentCard & {
  iconKey: string;
  accent: string;
  iconLabel: string;
};

export type ProjectApproachStep = [step: string, title: string, body: string];

export type ProjectDetailSections = {
  problem: {
    title: string;
    body: string;
    quote?: string;
    metrics: ProjectMetric[];
  };
  solution: {
    title: string;
    body: string;
    beforeItems: string[];
    beforeNote: string;
    afterUrl: string;
    afterNote: string;
  };
  approach: {
    title: string;
    steps: ProjectApproachStep[];
  };
  architecture: {
    title: string;
    clientLabel: string;
    middleLabel: string;
    middleConnector: string;
    footerNote: string;
    cards: ProjectContentCard[];
  };
  features: {
    title: string;
    cards: ProjectFeatureCard[];
  };
  decisions: {
    title: string;
    rows: ProjectContentCard[];
  };
  skills: {
    title: string;
    cards: ProjectContentCard[];
  };
  challenges: {
    title: string;
    cards: ProjectContentCard[];
  };
};

export type ProjectDetailContent = {
  heroMetrics: ProjectMetric[];
  browserBar: string;
  heroPlaceholder: string;
  lastUpdated: string;
  sections: ProjectDetailSections;
};

export const projectDetails: Record<string, ProjectDetailContent> = {
  codecollab: {
    heroMetrics: [
      { label: "ROLE", value: "Solo • Design + Build" },
      { label: "TIMELINE", value: "Sept 2025" },
      { label: "STATUS", value: "v1.2 - shipped" },
      { label: "PERF", value: "Lighthouse 90+" },
    ],
    browserBar: "codecollab.app/r/sum-fn",
    heroPlaceholder: "[ hero product screenshot - full editor view with cursors + presence rail ]",
    lastUpdated: "Sept 2025",
    sections: {
      problem: {
        title: "Pairing eats context. Tools punish it.",
        body: "Pair programming today means juggling VS Code Live Share, a Discord call, a shared whiteboard for diagrams, and a Github PR for review. Four tools, four tabs, four sync points. Every switch is a context tax - by the time you've alt-tabbed to leave a comment, you've forgotten what you wanted to say.",
        quote: "I just want to point at line 47 and say 'this is wrong' without joining a call. - interview, senior eng at fintech",
        metrics: [
          { label: "tools per pair session (avg)", value: "4.2" },
          { label: "sync latency target", value: "<100ms" },
          { label: "nested files supported", value: "50+" },
        ],
      },
      solution: {
        title: "One room. Editor, voice, review - same surface.",
        body: "CodeCollab compresses four tools into one persistent room. Open a link, you're in. Live cursors with names, conflict-safe line locks via Monaco Editor, a VS Code-style file explorer, and in-editor chat - all without leaving the editor pane.",
        beforeItems: ["VS Code + Live Share", "Discord call", "Excalidraw tab", "Github PR review"],
        beforeNote: "4 surfaces, 3 logins, 2 sync delays",
        afterUrl: "codecollab.app/r/{room}",
        afterNote: "1 surface, 0 setup, real-time",
      },
      approach: {
        title: 'How I got from "pairing is broken" to v1.',
        steps: [
          ["step 01", "Research - 12 interviews, 3 weeks", "Mapped pain points across solo devs, senior engineers, bootcamp mentors. Found the same context-switch complaint across all 3 cohorts."],
          ["step 02", "Scope cut - one room, no orgs, no billing", "Killed accounts, teams, persistence v1. A room = a URL = ephemeral. Faster ship, cleaner story."],
          ["step 03", "Prototype - Monaco + Supabase Realtime", "Stood up cursor sync first to test latency. Sub-100ms state sync with RBAC for editor and viewer permissions on the free tier."],
          ["step 04", "Conflict model - line locks, not OT", "CRDT/OT was overkill for pairing semantics. Soft line-locks with visual indicators matched the mental model."],
          ["step 05", "Ship on Vercel - optimize and launch", "Code-splitting and lazy loading pushed Lighthouse above 90. Added presence tracking and in-editor chat for pair programming and remote teaching."],
        ],
      },
      architecture: {
        title: "How the room stays in sync.",
        clientLabel: "Client (Next.js 15)",
        middleLabel: "Supabase Realtime",
        middleConnector: "| ▲ realtime channel | ▲ presence |",
        footerNote: "editor ops broadcast on debounce(40ms). cursor positions on raf. presence on heartbeat(2s). single channel per room.",
        cards: [
          { title: "Monaco Editor", body: "view + line locks" },
          { title: "Redux Toolkit", body: "presence + session" },
          { title: "Tailwind CSS", body: "UI + layout" },
          { title: "Postgres", body: "rooms, files" },
          { title: "Broadcast", body: "cursors, ops" },
          { title: "RBAC", body: "editor / viewer" },
        ],
      },
      features: {
        title: 'Six features that earn the "one tool" claim.',
        cards: [
          {
            title: "Live cursors with line locks",
            body: "Sub-100ms sync via Supabase Realtime. Conflict-safe line-locking through Monaco Editor stops two people editing the same line.",
            iconKey: "cursor",
            accent: "#8fb88f",
            iconLabel: "cursor sync",
          },
          {
            title: "VS Code-style file explorer",
            body: "Nested project structures across 50+ files without performance degradation. Folder tree, file tabs, and quick open in one pane.",
            iconKey: "git",
            accent: "#c3c7f4",
            iconLabel: "file tree",
          },
          {
            title: "Presence + in-editor chat",
            body: "Real-time presence tracking via Supabase channels. In-editor chat for pair programming and remote teaching with mixed-permission users.",
            iconKey: "message",
            accent: "#ffddc0",
            iconLabel: "presence",
          },
          {
            title: "RBAC permissions",
            body: "Role-based editor and viewer access. Organisers control who can edit and who can watch without rebuilding the room.",
            iconKey: "users",
            accent: "#d4b483",
            iconLabel: "rbac",
          },
          {
            title: "Native Git in-room",
            body: "Push, pull, diff, branch switch from the editor. No terminal context switch.",
            iconKey: "git",
            accent: "#9db7ff",
            iconLabel: "in-room git",
          },
          {
            title: "Zero-friction rooms",
            body: "A URL is the auth. Deployed on Vercel with Lighthouse performance above 90 through code-splitting and lazy loading.",
            iconKey: "link",
            accent: "#7bd0c4",
            iconLabel: "join by url",
          },
        ],
      },
      decisions: {
        title: "Decisions worth defending.",
        rows: [
          {
            title: "Soft line locks over CRDTs",
            body: "CRDT/OT solves character-level merge - pairing rarely needs that. Soft locks match how humans actually pair: 'I've got this function, take the next one.'",
          },
          {
            title: "URL as auth",
            body: "Skipped accounts entirely. The link is the credential - same model as Google Docs anonymous share. Removed a 4-step funnel before the first edit.",
          },
          {
            title: "Supabase Realtime over custom WS",
            body: "Built-in presence channels and Postgres-backed rooms cut infra time. Sub-100ms sync on free tier was enough to validate before scaling.",
          },
          {
            title: "Monaco over CodeMirror 6",
            body: "Monaco's decoration API is heavier but its multi-cursor + IntelliSense came free. Bundle cost (~600KB) acceptable for the editor being the product.",
          },
          {
            title: "RBAC from v1",
            body: "Remote teaching needs viewer roles. Editor/viewer split via Supabase RLS kept permissions server-side instead of trusting client flags.",
          },
        ],
      },
      skills: {
        title: "What I stretched on this one.",
        cards: [
          {
            title: "DESIGN",
            body: "Interaction design for multi-user state · Presence UI patterns · Dark-mode color systems · Latency-tolerant micro-feedback",
          },
          {
            title: "ENGINEERING",
            body: "Realtime systems · Monaco decorations + ranges · Redux Toolkit for shared state · Supabase Realtime · Next.js App Router on Vercel",
          },
          {
            title: "PERFORMANCE",
            body: "Code-splitting · Lazy loading · Lighthouse tuning above 90 · File tree rendering across 50+ nested files",
          },
          {
            title: "PRODUCT",
            body: "Scope discipline (cut accounts, billing, orgs from v1) · RBAC for teaching workflows · Beta → GA decision criteria",
          },
        ],
      },
      challenges: {
        title: "Things that broke, things I learned.",
        cards: [
          {
            title: "Cursor drift at 4+ users",
            body: "Broadcast-on-every-keystroke flooded the channel. Fixed with 40ms debounce + raf-batched cursor updates. Latency went from 180ms p95 to 65ms.",
          },
          {
            title: "File tree at 50+ nested files",
            body: "Rendering every node upfront killed scroll performance. Virtualized the explorer and lazy-loaded file contents on tab open.",
          },
          {
            title: "Monaco + Next.js App Router",
            body: "Monaco's worker loading didn't play with App Router defaults. Dynamic import + custom worker resolver fixed the bundle split.",
          },
        ],
      },
    },
  },

  codeclash: {
    heroMetrics: [
      { label: "ROLE", value: "Full Stack" },
      { label: "TIMELINE", value: "Aug 2025" },
      { label: "STATUS", value: "v1.0 - shipped" },
      { label: "LANGUAGES", value: "4 eval'd" },
    ],
    browserBar: "codeclash.notsg.space/contest/live",
    heroPlaceholder: "[ hero screenshot - live contest leaderboard + code editor ]",
    lastUpdated: "Aug 2025",
    sections: {
      problem: {
        title: "Competitive programming needs more than a judge.",
        body: "Most platforms handle contests well but fall apart on spontaneous 1v1 battles. Competitive programmers want fast matchmaking, instant verdicts, and contest formats they already know - ACM-ICPC and Codeforces-style - without switching tools or waiting on manual pairing.",
        quote: "I want to challenge my friend right now, not schedule a contest for next week.",
        metrics: [
          { label: "matchmaking target", value: "<10s" },
          { label: "languages evaluated", value: "4" },
          { label: "contest formats", value: "2" },
        ],
      },
      solution: {
        title: "1v1 battles and full contests on one platform.",
        body: "CodeClash pairs two players head to head in under 10 seconds and runs public and private contests with real-time leaderboards, auto-redirect timers, and automatic code evaluation. Organisers create, join, and configure contests; participants climb a global rating system with performance tiers and achievement badges.",
        beforeItems: ["Separate 1v1 tools", "Manual contest setup", "Delayed verdict queues", "No shared rating"],
        beforeNote: "4 tools, slow pairing, async results",
        afterUrl: "codeclash.notsg.space/match",
        afterNote: "1 platform, instant pairing, live verdicts",
      },
      approach: {
        title: "From queue-based battles to full contest infra.",
        steps: [
          ["step 01", "Core loop - 1v1 matchmaking", "Built a queue-based pairing system that matches two players in under 10 seconds with three DSA questions and a real-time winner."],
          ["step 02", "Auto-evaluation pipeline", "Wired automatic code evaluation for Python, JavaScript, Java, and C++ with near-zero wait on verdict return."],
          ["step 03", "Contest formats", "Added public and private contests in ACM-ICPC and Codeforces-style formats with configurable problem sets."],
          ["step 04", "Auth + roles via JWT", "JWT-based authentication with role-based contest management - create, join, configure - separating participants from organisers."],
          ["step 05", "Rating + badges", "Shipped a global rating system with performance tiers and achievement badges to keep players coming back."],
        ],
      },
      architecture: {
        title: "How contests stay live and fair.",
        clientLabel: "Client (Next.js + Redux)",
        middleLabel: "REST API + Judge",
        middleConnector: "| ▲ submit | ▲ leaderboard |",
        footerNote: "JWT on every protected route. contest state in Redux. verdict polling on submit. timer auto-redirect on expiry.",
        cards: [
          { title: "Next.js", body: "pages + routing" },
          { title: "Redux", body: "contest state" },
          { title: "JWT Auth", body: "roles + sessions" },
          { title: "REST APIs", body: "contests, submit" },
          { title: "Judge Service", body: "4 languages" },
          { title: "Tailwind CSS", body: "contest UI" },
        ],
      },
      features: {
        title: "Six features competitive programmers actually use.",
        cards: [
          {
            title: "Queue-based 1v1 matchmaking",
            body: "Two players matched in under 10 seconds. Three DSA questions, real-time winner decided on submission score and time.",
            iconKey: "users",
            accent: "#8fb88f",
            iconLabel: "matchmaking",
          },
          {
            title: "Auto code evaluation",
            body: "Automatic evaluation across Python, JavaScript, Java, and C++. Verdicts return with near-zero wait after submit.",
            iconKey: "cpu",
            accent: "#c3c7f4",
            iconLabel: "evaluator",
          },
          {
            title: "ACM-ICPC + Codeforces contests",
            body: "Public and private contests in both formats. Organisers configure problems, duration, and visibility from one flow.",
            iconKey: "trophy",
            accent: "#ffddc0",
            iconLabel: "contests",
          },
          {
            title: "Real-time leaderboards",
            body: "Live rank updates as submissions come in. Contest timers auto-redirect when time runs out.",
            iconKey: "timer",
            accent: "#d4b483",
            iconLabel: "leaderboard",
          },
          {
            title: "Role-based contest management",
            body: "JWT auth separates participants from organisers. Create, join, and configure contests with the right permissions per role.",
            iconKey: "shield",
            accent: "#9db7ff",
            iconLabel: "roles",
          },
          {
            title: "Global rating + badges",
            body: "Performance tiers and achievement badges on a global rating system. Contest setup to publish in under 2 minutes.",
            iconKey: "trophy",
            accent: "#7bd0c4",
            iconLabel: "rating",
          },
        ],
      },
      decisions: {
        title: "Decisions worth defending.",
        rows: [
          {
            title: "Queue matchmaking over scheduled rooms",
            body: "Scheduled rooms kill spontaneity. A simple queue with ELO-aware pairing gets two players coding in under 10 seconds.",
          },
          {
            title: "JWT roles over session cookies",
            body: "Stateless JWT let organisers and participants hit the same API with different scopes. Easier to scale contest endpoints independently.",
          },
          {
            title: "Four languages at launch",
            body: "Python, JavaScript, Java, and C++ cover 95% of college CP users. More languages planned but four was enough to ship the eval pipeline.",
          },
          {
            title: "Redux for contest state",
            body: "Contest timers, leaderboard updates, and submission status all need shared state across panels. Redux kept the live UI predictable.",
          },
          {
            title: "2-minute contest publish",
            body: "Optimised the organiser flow so problem attach, timer config, and publish happen in one screen. No wizard, no multi-page setup.",
          },
        ],
      },
      skills: {
        title: "What I stretched on this one.",
        cards: [
          {
            title: "ENGINEERING",
            body: "Queue-based matchmaking · REST API integration · JWT auth · Multi-language code evaluation · Real-time leaderboard updates",
          },
          {
            title: "FRONTEND",
            body: "Next.js + Redux state · Contest timer UX with auto-redirect · Tailwind CSS for dashboard-heavy layouts · Role-based UI per JWT scope",
          },
          {
            title: "PRODUCT",
            body: "ACM-ICPC and Codeforces format research · Organiser vs participant flows · Rating tiers and badge progression design",
          },
          {
            title: "SYSTEMS",
            body: "Submission queue handling · Verdict polling · Contest lifecycle (draft → live → frozen → rated) · Scale-ready API boundaries",
          },
        ],
      },
      challenges: {
        title: "Things that broke, things I learned.",
        cards: [
          {
            title: "Verdict latency under load",
            body: "Sequential judge calls stacked during peak contests. Moved to async polling with optimistic UI so players see submission status immediately.",
          },
          {
            title: "Timer drift across tabs",
            body: "Client-side timers desynced when users switched tabs. Server-authoritative countdown with auto-redirect on expiry fixed the trust issue.",
          },
          {
            title: "Role leaks in contest admin",
            body: "Organiser-only routes were client-gated only. Moved permission checks to JWT claims on the API and hid admin UI server-side.",
          },
        ],
      },
    },
  },

  "chess-platform": {
    heroMetrics: [
      { label: "ROLE", value: "Full Stack" },
      { label: "TIMELINE", value: "Nov 2025" },
      { label: "STATUS", value: "v1.0 - shipped" },
      { label: "CLOCK SYNC", value: "50ms" },
    ],
    browserBar: "chess-xi-ivory.vercel.app/play",
    heroPlaceholder: "[ hero screenshot - live game board with clock + move list ]",
    lastUpdated: "Nov 2025",
    sections: {
      problem: {
        title: "Online chess breaks on clocks, disconnects, and mobile.",
        body: "Most chess sites either force sign-up before the first move, let client-side clocks drift, or lose game state when a tab refreshes. Players want to jump in fast, trust the timer, recover from a bad connection, and play on phone or desktop without a degraded experience.",
        quote: "I just want to play a quick game on my phone without creating another account.",
        metrics: [
          { label: "clock accuracy", value: "50ms" },
          { label: "guest match time", value: "<30s" },
          { label: "Stockfish tiers", value: "3" },
        ],
      },
      solution: {
        title: "Real-time chess that works everywhere.",
        body: "Multiplayer chess with ELO-based matchmaking, server-driven clocks accurate to 50ms, and full game state recovery on disconnect. Play vs Computer powered by Stockfish across three difficulty tiers. Responsive UI with premoves, pawn promotions, move navigation, replay, and touch-gesture drag-and-drop on mobile.",
        beforeItems: ["Sign-up wall before first move", "Client-side clock drift", "Lost state on refresh", "Desktop-only board UX"],
        beforeNote: "4 friction points before move 10",
        afterUrl: "chess-xi-ivory.vercel.app/play",
        afterNote: "1 click, server clocks, full recovery",
      },
      approach: {
        title: "From socket prototype to full chess client.",
        steps: [
          ["step 01", "Core board + Socket.io sync", "Built the board UI in Next.js with move sync over Socket.io. Server owns game state in MongoDB from day one."],
          ["step 02", "Server-driven clocks", "Moved clocks to the server with 50ms accuracy. Client displays server time, never calculates elapsed time locally."],
          ["step 03", "Matchmaking + reconnect", "Added ELO-based pairing, reconnection handling, and full game state recovery so a dropped tab doesn't end the game."],
          ["step 04", "Stockfish vs Computer", "Integrated Stockfish for solo play across three difficulty tiers. Same board component, different game mode flag."],
          ["step 05", "Mobile + replay polish", "Touch-gesture drag-and-drop, premoves, pawn promotions, move navigation, and move-by-move replay on screens under 400px."],
        ],
      },
      architecture: {
        title: "How the game stays fair and in sync.",
        clientLabel: "Client (Next.js)",
        middleLabel: "Socket.io Server",
        middleConnector: "| ▲ moves | ▲ clocks |",
        footerNote: "server owns board state + clocks. client sends moves, receives authoritative updates. MongoDB persists games + ELO.",
        cards: [
          { title: "Next.js", body: "board + routing" },
          { title: "Socket.io", body: "move + clock sync" },
          { title: "Stockfish", body: "vs computer AI" },
          { title: "Node.js", body: "game server" },
          { title: "MongoDB", body: "games + ELO" },
          { title: "TypeScript", body: "shared types" },
        ],
      },
      features: {
        title: "Six features that make it feel like real chess.",
        cards: [
          {
            title: "Real-time multiplayer",
            body: "ELO-based matchmaking pairs players fairly. Guests and logged-in users both get into a match in under 30 seconds with just a name.",
            iconKey: "users",
            accent: "#8fb88f",
            iconLabel: "multiplayer",
          },
          {
            title: "Play vs Computer",
            body: "Stockfish-powered solo play across three difficulty tiers. Same board, same clocks, no opponent needed.",
            iconKey: "cpu",
            accent: "#c3c7f4",
            iconLabel: "stockfish",
          },
          {
            title: "Server-driven clocks",
            body: "Game clocks accurate to 50ms via Socket.io. Zero client-side drift - the server is the only source of truth for time.",
            iconKey: "timer",
            accent: "#ffddc0",
            iconLabel: "clocks",
          },
          {
            title: "Reconnect + state recovery",
            body: "Reconnection handling restores full game state after a disconnect. Refresh the tab, pick up exactly where you left off.",
            iconKey: "refresh",
            accent: "#d4b483",
            iconLabel: "reconnect",
          },
          {
            title: "Move replay + navigation",
            body: "Premoves, pawn promotions, move navigation, and a move-by-move replay system. Review any point in the game from the move list.",
            iconKey: "git",
            accent: "#9db7ff",
            iconLabel: "replay",
          },
          {
            title: "Mobile-first board",
            body: "Touch-gesture drag-and-drop piece movement on mobile. Full gameplay on screens under 400px with feature parity on desktop.",
            iconKey: "smartphone",
            accent: "#7bd0c4",
            iconLabel: "mobile",
          },
        ],
      },
      decisions: {
        title: "Decisions worth defending.",
        rows: [
          {
            title: "Server-authoritative clocks",
            body: "Client-side timers always drift. Server-driven clocks at 50ms accuracy mean disputes don't happen and players trust the time display.",
          },
          {
            title: "Guest play without sign-up",
            body: "A name field is enough to start. Accounts are optional for ELO tracking. Cut onboarding friction for casual sessions.",
          },
          {
            title: "Socket.io over raw WebSockets",
            body: "Built-in reconnection and room semantics saved weeks. Game state recovery on reconnect came almost free with Socket.io's event model.",
          },
          {
            title: "Single board component",
            body: "Multiplayer, vs Computer, and replay all render through one board. Different game mode flags, same drag-and-drop and promotion logic.",
          },
          {
            title: "Mobile-first from the start",
            body: "Touch gestures and 400px breakpoints were day-one requirements, not a retrofit. Desktop got hover states; mobile got drag-and-drop.",
          },
        ],
      },
      skills: {
        title: "What I stretched on this one.",
        cards: [
          {
            title: "ENGINEERING",
            body: "Socket.io realtime sync · Server-driven game clocks · ELO matchmaking · MongoDB game persistence · Stockfish integration",
          },
          {
            title: "FRONTEND",
            body: "Chess board UX · Touch-gesture drag-and-drop · Premoves and pawn promotions · Move-by-move replay · Mobile-first responsive layout",
          },
          {
            title: "SYSTEMS",
            body: "Reconnection handling · Full game state recovery · Server as single source of truth · Disconnect timeout policies",
          },
          {
            title: "PRODUCT",
            body: "Guest vs registered flows · Three Stockfish difficulty tiers · Sub-30s match target · Feature parity across screen sizes",
          },
        ],
      },
      challenges: {
        title: "Things that broke, things I learned.",
        cards: [
          {
            title: "Clock drift on background tabs",
            body: "Browsers throttle timers in background tabs. Moved all clock logic server-side and pushed updates every tick over Socket.io.",
          },
          {
            title: "State loss on reconnect",
            body: "Early versions reset the board on reconnect. Stored full game state in MongoDB and replayed moves on rejoin to restore position and clocks.",
          },
          {
            title: "Touch vs click on mobile",
            body: "Drag-and-drop libraries assumed mouse events. Built a touch-gesture layer that maps to the same move validation pipeline as desktop clicks.",
          },
        ],
      },
    },
  },
};
