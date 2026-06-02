import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Link2,
  MessageSquareQuote,
  Mic,
  MousePointer2,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { projects, personal, type Project } from "../../data";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

type Metric = {
  label: string;
  value: string;
};

type ContentCard = {
  title: string;
  body: string;
};

type FeatureCard = ContentCard & {
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  iconLabel: string;
};

function getStatusLabel(project: Project) {
  if (project.status === "live") return "v1.2 - shipped";
  if (project.status === "wip") return "v0.9 - in progress";
  return "v0.8 - archived";
}

function SectionHeading({
  index,
  file,
  title,
  body,
}: {
  index: string;
  file: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
      <div className="pt-1 text-[13px] font-medium tracking-[0.2em] text-[#8fb88f]">
        ## {index} - {file}
      </div>
      <div className="space-y-4">
        <h2 className="max-w-4xl text-[22px] font-semibold tracking-[-0.04em] text-[#f1f1f2] sm:text-[26px] lg:text-[30px]">
          {title}
        </h2>
        {body ? <p className="max-w-4xl text-[14px] leading-relaxed text-[#a5a5ab] sm:text-[15px]">{body}</p> : null}
      </div>
    </div>
  );
}

function SectionShell({
  index,
  file,
  title,
  body,
  children,
}: {
  index: string;
  file: string;
  title: string;
  body?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#16161a] pt-16 sm:pt-20 lg:pt-24">
      <SectionHeading index={index} file={file} title={title} body={body} />
      <div className="mt-10 lg:ml-[250px] xl:ml-[260px]">{children}</div>
    </section>
  );
}

function StatTile({ label, value }: Metric) {
  return (
    <div className="min-h-[96px] border border-[#202026] bg-[#0e0e11] px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#686870]">{label}</div>
      <div className="mt-2 text-[15px] tracking-[-0.02em] text-[#ececef]">{value}</div>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="border border-[#303037] bg-[#0d0d10] px-3 py-1 text-[12px] text-[#c9c9cf]">{children}</span>;
}

function FeatureVisual({ icon: Icon, accent, label }: { icon: React.ComponentType<{ className?: string }>; accent: string; label: string; }) {
  return (
    <div className="relative flex h-[120px] items-center justify-center overflow-hidden border-b border-[#1b1b20] bg-[#0d0d10] px-4 sm:h-[160px]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${accent}22 0%, transparent 55%)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="relative flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2b2b31] bg-[#111114]" style={{ boxShadow: `0 0 0 1px ${accent}33 inset, 0 0 24px ${accent}22`, color: accent }}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-[11px] uppercase tracking-[0.24em]" style={{ color: accent }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-[#1f1f24] bg-[#101114] ${className}`.trim()}>{children}</div>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ projectId: project.id }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = projects.find((entry) => entry.id === projectId);

  if (!project) {
    notFound();
  }

  const currentProjectIndex = projects.findIndex((entry) => entry.id === project.id);
  const previousProject = projects[(currentProjectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentProjectIndex + 1) % projects.length];
  const isCodeCollab = project.id === "codecollab";
  const statusText = getStatusLabel(project);

  const heroMetrics: Metric[] = isCodeCollab
    ? [
        { label: "ROLE", value: "Solo • Design + Build" },
        { label: "TIMELINE", value: "Jan - Apr 2025" },
        { label: "STATUS", value: statusText },
        { label: "USERS", value: "~1.2k rooms / mo" },
      ]
    : [
        { label: "ROLE", value: project.role },
        { label: "TIMELINE", value: project.date },
        { label: "STATUS", value: statusText },
        { label: "SCOPE", value: String(project.stack.length) },
      ];

  const researchCards: Metric[] = isCodeCollab
    ? [
        { label: "tools per pair session (avg)", value: "4.2" },
        { label: "of sync time spent context-switching", value: "38%" },
        { label: "interviews informing scope", value: "~12" },
      ]
    : [
        { label: "stack items", value: String(project.stack.length) },
        { label: "highlights", value: String(project.highlights.length) },
        { label: "live links", value: String(project.links.length) },
      ];

  const beforeItems = ["VS Code + Live Share", "Discord call", "Excalidraw tab", "Github PR review"];

  const architectureCards: ContentCard[] = isCodeCollab
    ? [
        { title: "Monaco Editor", body: "view + decorations" },
        { title: "Redux Toolkit", body: "presence + locks" },
        { title: "WebRTC Voice", body: "P2P mesh s6" },
        { title: "Postgres", body: "rooms, files" },
        { title: "Broadcast", body: "cursors, ops" },
        { title: "Presence", body: "who's in room" },
      ]
    : project.stack.slice(0, 6).map((item) => ({
        title: item,
        body: `Used across ${project.name.replace("feat: ", "")}.`,
      }));

  const featureCards: FeatureCard[] = isCodeCollab
    ? [
        {
          title: "Live cursors with line locks",
          body: "Sub-100ms sync. Soft locks prevent two people editing the same line - no conflict resolution UI needed.",
          placeholder: "[ cursors + name labels GIF ]",
          icon: MousePointer2,
          accent: "#8fb88f",
          iconLabel: "cursor sync",
        },
        {
          title: "Scoped voice chat",
          body: "Voice attaches to the file you're viewing. Open another file, you're in a different conversation.",
          placeholder: "[ voice indicator UI ]",
          icon: Mic,
          accent: "#c3c7f4",
          iconLabel: "file voice",
        },
        {
          title: "Line-anchored reviews",
          body: "Highlight any range, leave a thread. Threads persist with the room and surface on GitHub push.",
          placeholder: "[ inline review thread ]",
          icon: MessageSquareQuote,
          accent: "#ffddc0",
          iconLabel: "line review",
        },
        {
          title: "Native Git in-room",
          body: "Push, pull, diff, branch switch from the editor. No terminal context switch.",
          placeholder: "[ GitHub push panel ]",
          icon: GitBranch,
          accent: "#d4b483",
          iconLabel: "in-room git",
        },
        {
          title: "Presence rail",
          body: "Always-on right rail showing who's in which file. Click an avatar to follow their viewport.",
          placeholder: "[ presence rail ]",
          icon: Users,
          accent: "#9db7ff",
          iconLabel: "presence",
        },
        {
          title: "Zero-friction rooms",
          body: "A URL is the auth. No accounts, no installs. Rooms auto-expire 24h after last activity.",
          placeholder: "[ ephemeral room ]",
          icon: Link2,
          accent: "#7bd0c4",
          iconLabel: "join by url",
        },
      ]
    : project.stack.map((item) => ({
        title: item,
        body: `Used as part of the ${project.role.toLowerCase()} stack for this build.`,
        placeholder: `[ ${item} ]`,
        icon: MousePointer2,
        accent: "#8fb88f",
        iconLabel: "feature",
      }));

  const decisionRows: ContentCard[] = isCodeCollab
    ? [
        {
          title: "Soft line locks over CRDTs",
          body: "CRDT/OT solves character-level merge - pairing rarely needs that. Soft locks match how humans actually pair: 'I've got this function, take the next one.'",
        },
        {
          title: "URL as auth",
          body: "Skipped accounts entirely. The link is the credential - same model as Google Docs anonymous share. Removed a 4-step funnel before the first edit.",
        },
        {
          title: "Voice scoped to file",
          body: "Discord-style always-on voice made the wrong default loud. File-scoped voice means split work stays split - you can't accidentally interrupt.",
        },
        {
          title: "Monaco over CodeMirror 6",
          body: "Monaco's decoration API is heavier but its multi-cursor + IntelliSense came free. Bundle cost (~600KB) acceptable for the editor being the product.",
        },
        {
          title: "Dark mode only",
          body: "Audience is devs. Skipped theme toggle to ship faster - added in v1.2 after 6 user requests.",
        },
      ]
    : project.highlights.map((highlight, index) => ({
        title: `Decision ${index + 1}`,
        body: highlight,
      }));

  const skillCards: ContentCard[] = isCodeCollab
    ? [
        {
          title: "DESIGN",
          body: "Interaction design for multi-user state · Presence UI patterns · Dark-mode color systems · Latency-tolerant micro-feedback",
        },
        {
          title: "ENGINEERING",
          body: "Realtime systems · WebRTC signaling · Monaco decorations + ranges · Redux Toolkit for shared state · Next.js App Router",
        },
        {
          title: "RESEARCH",
          body: "12 user interviews · Affinity mapping · Beta cohort management · Bug triage from production logs",
        },
        {
          title: "PRODUCT",
          body: "Scope discipline (cut accounts, billing, orgs from v1) · Tradeoff framing · Beta → GA decision criteria",
        },
      ]
    : project.stack.map((item) => ({
        title: item,
        body: `Primary technology shaping ${project.name.replace("feat: ", "")}.`,
      }));

  const challengeCards: ContentCard[] = isCodeCollab
    ? [
        {
          title: "Cursor drift at 4+ users",
          body: "Broadcast-on-every-keystroke flooded the channel. Fixed with 40ms debounce + raf-batched cursor updates. Latency went from 180ms p95 to 65ms.",
        },
        {
          title: "Voice mesh past 6 peers",
          body: "P2P WebRTC mesh CPU-bombed at 7+ peers. Capped rooms at 6 for v1 with a clear 'session full' state; SFU planned for v2.",
        },
        {
          title: "Monaco + Next.js App Router",
          body: "Monaco's worker loading didn't play with App Router defaults. Dynamic import + custom worker resolver - documented in a blog post.",
        },
      ]
    : project.highlights.slice(0, 3).map((highlight, index) => ({
        title: `Challenge ${index + 1}`,
        body: highlight,
      }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090a] text-[#e8e8ea]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:30px_30px] opacity-10" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(142,255,150,0.07)_0%,rgba(142,255,150,0.03)_28%,transparent_72%)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-[#16161a] bg-[#0a0a0b]/92 backdrop-blur">
        <div className="mx-auto flex h-[68px] w-full max-w-[1480px] items-center justify-between px-5 sm:px-8 xl:px-10">
          <span className="text-[16px] font-bold tracking-tight text-[#e8e8ea]">
            {personal.initials}.
          </span>

          <nav className="flex items-center gap-8 text-[14px] text-[#a8a8ad]">
            <Link href="/#about" className="transition-colors duration-150 hover:text-[#e8e8ea]">
              about
            </Link>
            <Link href="/#projects" className="transition-colors duration-150 hover:text-[#e8e8ea]">
              projects
            </Link>
            <Link href="/#experience" className="transition-colors duration-150 hover:text-[#e8e8ea]">
              writing
            </Link>
            <Link href="/#contact" className="transition-colors duration-150 hover:text-[#e8e8ea]">
              contact
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-5 sm:px-8 xl:px-10">
        <div className="mt-1 flex items-center gap-2 text-[12px] text-[#7c7c85]">
          <span className="text-[#8f8f96]">❯</span>
          <span>cd ~/projects/{project.id} &amp;&amp; cat README.md</span>
        </div>

        <section className="mt-8 space-y-7">
          <div className="flex flex-wrap items-center gap-3 text-[12px]">
            <span className="text-[#8fb88f]">●</span>
            <span className="text-[#f2f2f3]">feat:</span>
            <span className="text-[#f2f2f3]">{project.name.replace("feat: ", "")}</span>
            <span className="border border-[#2f2f35] bg-[#0f1013] px-2 py-0.5 text-[#8fb88f]">2025</span>
            <span className="border border-[#2f2f35] bg-[#0f1013] px-2 py-0.5 text-[#8fb88f]">HEAD</span>
            <span className="border border-[#2f2f35] bg-[#0f1013] px-2 py-0.5 text-[#a8a8ad]">shipped</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-[12ch] text-[44px] font-semibold tracking-[-0.06em] text-[#f2f2f3] sm:text-[60px] lg:text-[72px] xl:text-[80px]">
                {project.name.replace("feat: ", "")}
              </h1>
              <p className="max-w-3xl text-[15px] leading-[1.75] text-[#b0b0b6] sm:text-[16px]">
                {project.excerpt}
              </p>
            </div>

            <div className="hidden shrink-0 gap-2 pt-3 xl:flex">
              {project.links.map((linkItem) => (
                <a
                  key={linkItem.label}
                  href={linkItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-[#2a2a30] bg-[#0e0f12] px-4 py-2 text-[13px] text-[#e8e8ea] transition-colors duration-200 hover:border-[#8fb88f] hover:text-[#8fb88f]"
                >
                  <span className="text-[12px] text-[#8f8f96]">↗</span>
                  <span>{linkItem.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.stack.map((tag) => (
              <Tag key={tag}>[{tag}]</Tag>
            ))}
          </div>

          <div className="relative overflow-hidden border border-[#1f1f24] bg-[#0d0d10] p-2.5 sm:p-3">
            <div className="flex items-center gap-2 border-b border-[#1c1c20] pb-3 text-[#5d5d65]">
              <span className="h-3 w-3 rounded-full bg-[#2d2d32]" />
              <span className="h-3 w-3 rounded-full bg-[#2d2d32]" />
              <span className="h-3 w-3 rounded-full bg-[#2d2d32]" />
              <span className="ml-2 text-[12px] text-[#72727a]">codecollab.app/r/sum-fn</span>
            </div>

            <div className="relative mt-2.5 min-h-[190px] overflow-hidden border border-[#19191e] bg-[#0b0b0e] sm:min-h-[290px] lg:min-h-[320px]">
              <Image
                src={project.image}
                alt={`${project.name.replace("feat: ", "")} screenshot`}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,11,0.2),rgba(10,10,11,0.42))]" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="max-w-md border border-[#24242a] bg-[#080809]/70 px-5 py-3 text-[12px] text-[#5f5f66] backdrop-blur-[1px]">
                  [ hero product screenshot - full editor view with cursors + presence rail ]
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 border-t border-[#16161a] pt-10 sm:grid-cols-2 xl:grid-cols-4">
          {heroMetrics.map((metric) => (
            <StatTile key={metric.label} {...metric} />
          ))}
        </section>

        <SectionShell
          index="01"
          file="problem.md"
          title="Pairing eats context. Tools punish it."
          body="Pair programming today means juggling VS Code Live Share, a Discord call, a shared whiteboard for diagrams, and a Github PR for review. Four tools, four tabs, four sync points. Every switch is a context tax - by the time you've alt-tabbed to leave a comment, you've forgotten what you wanted to say."
        >
          <div className="border-l border-[#2f2f35] pl-5 italic text-[13px] leading-relaxed text-[#777780] sm:text-[14px]">
            “I just want to point at line 47 and say &apos;this is wrong&apos; without joining a call.” - interview, senior eng at fintech
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {researchCards.map((metric) => (
              <StatTile key={metric.label} {...metric} />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          index="02"
          file="solution.md"
          title="One room. Editor, voice, review - same surface."
          body="CodeCollab compresses four tools into one persistent room. Open a link, you're in. Live cursors with names, line-level locks to stop step-on edits, voice that scopes to the file you're both looking at, and PR-style review threads anchored to lines - all without leaving the editor pane."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <Panel className="p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#7c7c85]">before</div>
              <div className="mt-4 space-y-1.5 text-[14px] leading-relaxed text-[#d7d7dd]">
                {beforeItems.map((item) => (
                  <div key={item}>{item}</div>
                ))}
                <div className="pt-4 text-[12px] text-[#73737b]">- 4 surfaces, 3 logins, 2 sync delays</div>
              </div>
            </Panel>

            <Panel className="border-[#234328] bg-[#101c10] p-5 text-[#d9f1d9]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#8fb88f]">after</div>
              <div className="mt-4 space-y-4">
                <div className="font-mono text-[14px]">codecollab.app/r/{"{room}"}</div>
                <div className="font-mono text-[13px] text-[#8fb88f]">- 1 surface, 0 setup, real-time</div>
              </div>
            </Panel>
          </div>
        </SectionShell>

        <SectionShell index="03" file="approach.md" title='How I got from "pairing is broken" to v1.'>
          <div className="grid gap-0 border-l border-[#1f1f24]">
            {[
              ["step 01", "Research - 12 interviews, 3 weeks", "Mapped pain points across solo devs, senior engineers, bootcamp mentors. Found the same context-switch complaint across all 3 cohorts."],
              ["step 02", "Scope cut - one room, no orgs, no billing", "Killed accounts, teams, persistence v1. A room = a URL = ephemeral. Faster ship, cleaner story."],
              ["step 03", "Prototype - Monaco + Supabase Realtime", "Stood up cursor sync first to test latency. Sub-100ms across 4 simulated users on free tier - go ahead."],
              ["step 04", "Conflict model - line locks, not OT", "CRDT/OT was overkill for pairing semantics. Soft line-locks with visual indicators matched the mental model."],
              ["step 05", "Beta with 8 pairs - ship v1", "3 weeks of paired sessions, 47 bugs filed, 39 closed before launch. Shipped April 4."],
            ].map(([step, title, body], index) => (
              <div key={String(step)} className={`grid gap-4 border-b border-dashed border-[#1d1d22] py-6 last:border-b-0 lg:grid-cols-[160px_1fr] ${index === 0 ? "pt-0" : ""}`}>
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#8fb88f]">{String(step)}</div>
                <div>
                  <div className="text-[15px] text-[#f2f2f3]">{String(title)}</div>
                  <div className="mt-2 max-w-4xl text-[13px] leading-relaxed text-[#a8a8ad]">{String(body)}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="04" file="architecture.md" title="How the room stays in sync.">
          <div className="rounded border border-[#1f1f24] bg-[#0f1013] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="mx-auto mb-7 w-fit border border-[#777780] border-b-0 px-10 py-1 text-[12px] text-[#d7d7dd]">
                Client (Next.js 15)
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {architectureCards.slice(0, 3).map((card) => (
                  <div key={card.title} className="border border-[#2a2a30] bg-[#111114] px-5 py-4 text-center">
                    <div className="text-[14px] text-[#d8d8de]">{card.title}</div>
                    <div className="mt-1 text-[12px] text-[#767680]">{card.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 text-center text-[12px] text-[#6d6d74]">| ▲ realtime channel | ▲ signaling |</div>
              <div className="mx-auto mt-3 w-fit border border-[#777780] border-b-0 px-9 py-1 text-[12px] text-[#d7d7dd]">
                Supabase Realtime
              </div>

              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {architectureCards.slice(3).map((card) => (
                  <div key={card.title} className="border border-[#2a2a30] bg-[#111114] px-5 py-4 text-center">
                    <div className="text-[14px] text-[#d8d8de]">{card.title}</div>
                    <div className="mt-1 text-[12px] text-[#767680]">{card.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-[12px] leading-relaxed text-[#66666d]">
                editor ops broadcast on debounce(40ms). cursor positions on raf. presence on heartbeat(2s).
                <br />
                single channel per room.
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell index="05" file="features.md" title='Six features that earn the "one tool" claim.'>
          <div className="grid gap-4 md:grid-cols-2">
            {featureCards.map((card) => (
              <div key={card.title} className="overflow-hidden border border-[#1f1f24] bg-[#101114]">
                <FeatureVisual icon={card.icon} accent={card.accent} label={card.iconLabel} />
                <div className="p-4 sm:p-5">
                  <div className="text-[14px] text-[#f2f2f3]">{card.title}</div>
                  <div className="mt-2 text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="06" file="design-choices.md" title="Decisions worth defending.">
          <div className="overflow-hidden border border-[#1f1f24] bg-[#101114]">
            {decisionRows.map((card, index) => (
              <div
                key={card.title}
                className={`grid gap-4 px-5 py-4 lg:grid-cols-[280px_1fr] ${index !== decisionRows.length - 1 ? "border-b border-[#1b1b20]" : ""}`}
              >
                <div className="text-[13px] text-[#ececef]">{card.title}</div>
                <div className="text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="07" file="skills.md" title="What I stretched on this one.">
          <div className="grid gap-4 md:grid-cols-2">
            {skillCards.map((card) => (
              <div key={card.title} className="border border-[#1f1f24] bg-[#101114] p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8fb88f]">{card.title}</div>
                <div className="mt-3 text-[14px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="08" file="challenges.md" title="Things that broke, things I learned.">
          <div className="overflow-hidden border border-[#1f1f24] bg-[#101114]">
            {challengeCards.map((card, index) => (
              <div
                key={card.title}
                className={`grid gap-4 px-5 py-4 lg:grid-cols-[280px_1fr] ${index !== challengeCards.length - 1 ? "border-b border-[#1b1b20]" : ""}`}
              >
                <div className="text-[13px] text-[#ececef]">{card.title}</div>
                <div className="text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </SectionShell>

        <footer className="mt-16 border-t border-[#16161a] pt-10 text-[12px] text-[#7c7c85]">
          <div className="mb-4 flex items-center gap-2 pl-1 text-[#5d5d65]">
            <span className="text-[#8f8f96]">&gt;</span>
            <span>git log --oneline ~/projects</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Link
              href={`/projects/${previousProject.id}`}
              className="group border border-[#1f1f24] bg-[#101114] px-5 py-4 transition-colors duration-200 hover:border-[#8fb88f]"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#7c7c85]">
                <ChevronLeft className="h-3 w-3" /> previous
              </div>
              <div className="mt-3 text-[16px] text-[#f2f2f3] transition-colors duration-200 group-hover:text-[#8fb88f]">
                {previousProject.name}
              </div>
              <div className="mt-1 max-w-[26ch] text-[13px] leading-relaxed text-[#a8a8ad]">
                {previousProject.excerpt}
              </div>
            </Link>

            <Link
              href={`/projects/${nextProject.id}`}
              className="group border border-[#1f1f24] bg-[#101114] px-5 py-4 text-right transition-colors duration-200 hover:border-[#8fb88f]"
            >
              <div className="flex items-center justify-end gap-2 text-[11px] uppercase tracking-[0.18em] text-[#7c7c85]">
                next <ChevronRight className="h-3 w-3" />
              </div>
              <div className="mt-3 text-[16px] text-[#f2f2f3] transition-colors duration-200 group-hover:text-[#8fb88f]">
                {nextProject.name}
              </div>
              <div className="mt-1 ml-auto max-w-[26ch] text-[13px] leading-relaxed text-[#a8a8ad]">
                {nextProject.excerpt}
              </div>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#16161a] pt-6 text-[#7c7c85]">
            <div className="flex flex-wrap gap-4">
              <span>~/projects/{project.id}</span>
              <span>last updated Apr 2025</span>
              <span>shivanirai08.me © 2025</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}