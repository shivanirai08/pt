import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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

function formatStatus(project: Project) {
  if (project.status === "live") return "v1.2 - shipped";
  if (project.status === "wip") return "v0.9 - in progress";
  return "v0.8 - archived";
}

function splitSentenceBlock(text: string) {
  return text
    .split(/\.\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index, lines) => (
      <p key={`${line}-${index}`}>
        {line.endsWith(".") || index === lines.length - 1 ? line : `${line}.`}
      </p>
    ));
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
    <div className="space-y-3">
      <div className="text-[12px] text-[#7c7c85]">## {index} - {file}</div>
      <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#f2f2f3] sm:text-[26px]">
        {title}
      </h2>
      {body ? <p className="max-w-4xl text-[14px] leading-relaxed text-[#a8a8ad]">{body}</p> : null}
    </div>
  );
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

  const heroMetrics: Metric[] = isCodeCollab
    ? [
        { label: "ROLE", value: "Solo · Design · Build" },
        { label: "TIMELINE", value: "Jan - Apr 2025" },
        { label: "STATUS", value: formatStatus(project) },
        { label: "USERS", value: "~1.5k / mo" },
      ]
    : [
        { label: "ROLE", value: project.role },
        { label: "TIMELINE", value: project.date },
        { label: "STATUS", value: formatStatus(project) },
        { label: "SCOPE", value: project.stack.length.toString() },
      ];

  const researchCards: Metric[] = isCodeCollab
    ? [
        { label: "tools per session", value: "4.2" },
        { label: "time lost to context", value: "38%" },
        { label: "interviews informing scope", value: "~12" },
      ]
    : [
        { label: "stack items", value: project.stack.length.toString() },
        { label: "highlights", value: project.highlights.length.toString() },
        { label: "live links", value: project.links.length.toString() },
      ];

  const solutionCards: ContentCard[] = isCodeCollab
    ? [
        {
          title: "One room, one source of truth.",
          body:
            "Code, voice, chat, and review all stay on the same surface. The result is less app switching and less mental reassembly after every edit.",
        },
        {
          title: "Presence is visible, not implied.",
          body:
            "Live cursors, line locks, and state-aware panels give people enough signal to coordinate without turning the screen into a meeting room.",
        },
      ]
    : project.highlights.map((highlight, index) => ({
        title: `Highlight ${index + 1}`,
        body: highlight,
      }));

  const flowSteps: ContentCard[] = isCodeCollab
    ? [
        { title: "Research", body: "12 interviews over 3 weeks to understand the pairing pain points." },
        { title: "Scope cut", body: "Kept the surface tight: editor, presence, voice, chat, and GitHub." },
        { title: "Prototype", body: "Validated latency, cursor sync, and visual density before adding more." },
        { title: "Control", body: "Line locks and session state were tuned to avoid accidental collisions." },
        { title: "Beta", body: "Rolled out to a small group of pairs, then hardened the defaults." },
      ]
    : project.highlights.map((highlight, index) => ({
        title: `Step ${index + 1}`,
        body: highlight,
      }));

  const architectureBlocks: ContentCard[] = isCodeCollab
    ? [
        { title: "Monaco editor", body: "Shared code surface with line-aware edits." },
        { title: "Redux Toolkit", body: "Session state for participants, panels, and editor sync." },
        { title: "Supabase Realtime", body: "Presence and live updates across the room." },
        { title: "WebRTC voice", body: "Low-latency audio that stays adjacent to the editor." },
      ]
    : project.stack.slice(0, 4).map((item) => ({
        title: item,
        body: `Used across ${project.name.replace("feat: ", "")} to keep the experience cohesive.`,
      }));

  const featureCards: ContentCard[] = isCodeCollab
    ? [
        {
          title: "Live cursors with line locks",
          body: "Signals intent at the line level so pairs can edit without stepping on each other.",
        },
        {
          title: "Scoped voice chat",
          body: "Voice lives beside the file, not in a separate tab, so the conversation stays attached to the work.",
        },
        {
          title: "Line-anchored reviews",
          body: "Highlights stay pinned to the exact context that needs attention.",
        },
        {
          title: "Native Git in room",
          body: "Push, pull, diff, and review without leaving the collaboration surface.",
        },
        {
          title: "Presence rail",
          body: "Makes collaborators visible even when they are not actively editing.",
        },
        {
          title: "Zero-friction rooms",
          body: "Rooms auto-expire after inactivity, keeping the mental model simple.",
        },
      ]
    : project.stack.map((item, index) => ({
        title: item,
        body: `Used as part of the ${project.role.toLowerCase()} stack for this build, with ${index + 1} of ${project.stack.length} highlighted here.`,
      }));

  const decisionCards: ContentCard[] = isCodeCollab
    ? [
        {
          title: "Soft line locks over CRDTs",
          body: "Enough coordination for pairs, without the complexity overhead of full document conflict resolution.",
        },
        {
          title: "URL as auth",
          body: "Skipped account creation for the first pass so join friction stayed near zero.",
        },
        {
          title: "Voice scoped to file",
          body: "Discord-style voice was broken into a lighter in-room pattern so the editor could stay central.",
        },
        {
          title: "Monaco over lightweight textarea",
          body: "The richer editor UI was worth the heavier payload because it matched the product’s purpose.",
        },
      ]
    : project.highlights.map((highlight, index) => ({
        title: `Decision ${index + 1}`,
        body: highlight,
      }));

  const skillCards = project.stack.map((item, index) => ({
    title: item,
    body:
      index === 0
        ? `Primary technology shaping ${project.name.replace("feat: ", "")}.`
        : `Supports the product through the collaboration layer and surrounding flows.`,
  }));

  const challengeCards: ContentCard[] = isCodeCollab
    ? [
        {
          title: "Cursor drift at 4+ users",
          body: "Broadcast timing had to be tightened so the channel felt stable under concurrent edits.",
        },
        {
          title: "Voice over flaky networks",
          body: "Fallback behavior and reconnect handling kept sessions understandable when audio degraded.",
        },
        {
          title: "Monaco bundle weight",
          body: "Dynamic imports and a focused first paint kept the initial experience usable.",
        },
      ]
    : project.highlights.slice(0, 3).map((highlight, index) => ({
        title: `Challenge ${index + 1}`,
        body: highlight,
      }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0b] text-[#e8e8ea]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-10" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,221,192,0.08)_0%,rgba(255,221,192,0.03)_28%,transparent_72%)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[#16161a] bg-[#0a0a0b]/92 backdrop-blur">
        <div className="mx-auto flex h-[68px] w-full max-w-[2400px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
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

      <div className="relative mx-auto w-full max-w-[1500px] px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="mt-1 flex items-center gap-2 text-[12px] text-[#7c7c85]">
          <span className="text-[#8f8f96]">❯</span>
          <span>cd ~/projects/{project.id} &amp;&amp; cat README.md</span>
        </div>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(310px,0.86fr)]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3 text-[12px]">
              <span className="text-[#8fb88f]">●</span>
              <span className="text-[#c3c7f4]">feat:</span>
              <span className="text-[#f2f2f3]">{project.name.replace("feat: ", "")}</span>
              <span className="rounded border border-[#3a3a3f] bg-[#101114] px-2 py-0.5 text-[#8fb88f]">
                head
              </span>
              <span className="rounded border border-[#3a3a3f] bg-[#101114] px-2 py-0.5 text-[#a8a8ad]">
                shipped
              </span>
              <span className="rounded border border-[#3a3a3f] bg-[#101114] px-2 py-0.5 text-[#a8a8ad]">
                <span className="uppercase tracking-[0.16em]">{project.status}</span>
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[11ch] text-[42px] font-semibold tracking-[-0.05em] text-[#f2f2f3] sm:text-[58px] lg:text-[68px] xl:text-[78px]">
                {project.name.replace("feat: ", "")}
              </h1>
              <p className="max-w-3xl text-[15px] leading-[1.75] text-[#b0b0b6] sm:text-[16px]">
                {project.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#2b2b31] bg-[#101013] px-3 py-1 text-[12px] text-[#c3c7f4]"
                >
                  [{tag.toLowerCase()}]
                </span>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="border border-[#1f1f24] bg-[#101114] p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#7c7c85]">
                    {metric.label}
                  </div>
                  <div className="mt-2 text-[15px] text-[#f2f2f3]">{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden border border-[#1f1f24] bg-[#111114] p-3 sm:p-4">
              <div className="flex items-center gap-2 border-b border-[#1c1c20] pb-3 text-[#5d5d65]">
                <span className="h-3 w-3 rounded-full bg-[#2d2d32]" />
                <span className="h-3 w-3 rounded-full bg-[#2d2d32]" />
                <span className="h-3 w-3 rounded-full bg-[#2d2d32]" />
                <span className="ml-2 text-[12px] text-[#72727a]">codecollab.app/?room=fn</span>
              </div>
              <div className="relative mt-3 min-h-[300px] overflow-hidden border border-[#1f1f24] bg-[#0d0d10] sm:min-h-[430px]">
                <Image
                  src={project.image}
                  alt={`${project.name.replace("feat: ", "")} screenshot`}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,11,0.18),rgba(10,10,11,0.35))]" />
                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5">
                  <div className="rounded border border-[#2b2b31] bg-[#0d0d10]/85 px-4 py-2 text-[12px] text-[#8f8f96] backdrop-blur-sm">
                    [ hero product screenshot - full editor view with cursor presence ]
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="border border-[#1f1f24] bg-[#101114] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#7c7c85]">quick links</div>
              <div className="mt-3 flex flex-col gap-2.5">
                {project.links.map((linkItem) => (
                  <a
                    key={linkItem.label}
                    href={linkItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-between gap-3 border border-[#2b2b31] bg-[#0e0f12] px-4 py-2.5 text-[13px] text-[#e8e8ea] transition-colors duration-200 hover:border-[#ffddc0] hover:text-[#ffddc0]"
                  >
                    <span>{linkItem.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="border border-[#1f1f24] bg-[#101114] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#7c7c85]">file info</div>
              <div className="mt-3 space-y-3 text-[13px] text-[#a8a8ad]">
                <div>
                  <div className="text-[#7c7c85]">role</div>
                  <div className="mt-0.5 text-[#f2f2f3]">{heroMetrics[0].value}</div>
                </div>
                <div>
                  <div className="text-[#7c7c85]">timeline</div>
                  <div className="mt-0.5 text-[#f2f2f3]">{heroMetrics[1].value}</div>
                </div>
                <div>
                  <div className="text-[#7c7c85]">status</div>
                  <div className="mt-0.5 text-[#f2f2f3]">{heroMetrics[2].value}</div>
                </div>
                <div>
                  <div className="text-[#7c7c85]">project</div>
                  <div className="mt-0.5 text-[#f2f2f3]">{project.id}</div>
                </div>
              </div>
            </div>

            <div className="border border-[#1f1f24] bg-[#111114] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#7c7c85]">summary</div>
              <div className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-[#a8a8ad]">
                {splitSentenceBlock(project.description)}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="21"
            file="problem.md"
            title={isCodeCollab ? "Pairing eats context. Tools punish it." : "What this project solved."}
            body={
              isCodeCollab
                ? "Pair programming today means juggling VS Code Live Share, a Discord call, a shared whiteboard for diagrams, and a GitHub PR for review. Every switch costs attention and breaks flow."
                : project.excerpt
            }
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {researchCards.map((metric) => (
              <div key={metric.label} className="border border-[#1f1f24] bg-[#101114] p-5">
                <div className="text-[12px] text-[#7c7c85]">{metric.value}</div>
                <div className="mt-2 text-[12px] leading-relaxed text-[#a8a8ad]">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="22"
            file="solution.md"
            title={isCodeCollab ? "One room. Editor, voice, review - same surface." : "Why the layout is structured this way."}
            body={
              isCodeCollab
                ? "CodeCollab compresses the whole collaboration loop into one persistent room. The editor stays central, presence is explicit, and the surrounding tools never displace the work surface."
                : project.description
            }
          />

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="border border-[#1f1f24] bg-[#101114] p-5">
              <div className="text-[12px] uppercase tracking-[0.2em] text-[#7c7c85]">editor notes</div>
              <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-[#a8a8ad]">
                <p>{solutionCards[0]?.body ?? project.description}</p>
                <p>
                  {isCodeCollab
                    ? "The first pass kept everything visible at once, then I trimmed it until the collaboration path stayed readable at a glance."
                    : "The same principle keeps this page readable: one strong preview, then supporting context around it."}
                </p>
              </div>

              <div className="mt-5 rounded border border-[#1f1f24] bg-[#0d0d10] p-4 font-mono text-[12px] leading-relaxed text-[#7c7c85]">
                <div>cd ~/projects/{project.id}</div>
                <div>npm run build</div>
                <div>npm run deploy</div>
                <div>git push origin main</div>
              </div>
            </div>

            <div className="border border-[#27402d] bg-[#0f160f] p-5 text-[#cfe9cf]">
              <div className="text-[12px] uppercase tracking-[0.2em] text-[#8fb88f]">solution</div>
              <div className="mt-4 space-y-4 text-[13px] leading-relaxed">
                <div className="text-[14px] text-[#f2f2f3]">{solutionCards[1]?.title ?? "One room, one source of truth."}</div>
                <p>{solutionCards[1]?.body ?? project.description}</p>
                <p>
                  {isCodeCollab
                    ? "That means the UI has to explain the room before it asks for action, and the collaboration cues must stay visible even when the file is busy."
                    : "This is where the visual language stays calm: the project should read as a finished system, not a pile of features."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-[#1f1f24] bg-[#101114] p-5">
              <div className="text-[12px] text-[#7c7c85]">workflow</div>
              <div className="mt-4 space-y-4">
                {flowSteps.map((step, index) => (
                  <div key={step.title} className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-start">
                    <div className="text-[12px] uppercase tracking-[0.2em] text-[#8fb88f]">
                      step {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="text-[14px] text-[#f2f2f3]">{step.title}</div>
                      <div className="mt-1 text-[13px] leading-relaxed text-[#a8a8ad]">{step.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#1f1f24] bg-[#0f140f] p-5 text-[#cfe9cf]">
              <div className="text-[12px] uppercase tracking-[0.2em] text-[#8fb88f]">note</div>
              <div className="mt-4 space-y-3 text-[13px] leading-relaxed">
                <p>
                  {isCodeCollab
                    ? "I tried to keep the first interaction lightweight enough that someone joining a session does not need a tutorial before typing."
                    : "The page keeps the same dark, dense rhythm as the home section so the project feels like a continuation rather than a different product."}
                </p>
                <p>
                  {isCodeCollab
                    ? "That decision shows up everywhere: fewer panels, more signal, and a UI that explains the room before it asks for action."
                    : "That matters because the detail route should feel like the same portfolio, not a detached case-study template."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="24"
            file="architecture.md"
            title={isCodeCollab ? "How the room stays in sync." : "How the stack stays aligned."}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {architectureBlocks.map((block) => (
              <div key={block.title} className="border border-[#1f1f24] bg-[#111114] p-5">
                <div className="text-[12px] text-[#8fb88f]">{block.title}</div>
                <div className="mt-3 text-[13px] leading-relaxed text-[#a8a8ad]">{block.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="25"
            file="features.md"
            title={isCodeCollab ? "Six features that earn the one-tool claim." : "Capability cards."}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <div key={card.title} className="min-h-[180px] border border-[#1f1f24] bg-[#101114] p-5">
                <div className="h-28 border border-[#17171c] bg-[#0d0d10]" />
                <div className="mt-4 text-[14px] text-[#f2f2f3]">{card.title}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="26"
            file="decisions.md"
            title={isCodeCollab ? "Decisions worth defending." : "Why each choice makes sense."}
          />

          <div className="mt-8 overflow-hidden border border-[#1f1f24] bg-[#101114]">
            {decisionCards.map((card, index) => (
              <div
                key={card.title}
                className={`grid gap-4 px-5 py-4 md:grid-cols-[0.34fr_0.66fr] ${
                  index !== decisionCards.length - 1 ? "border-b border-[#1b1b20]" : ""
                }`}
              >
                <div className="text-[13px] text-[#f2f2f3]">{card.title}</div>
                <div className="text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="27"
            file="skills.md"
            title={isCodeCollab ? "What I stretched on this one." : "What the build leaned on."}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {skillCards.map((card) => (
              <div key={card.title} className="border border-[#1f1f24] bg-[#111114] p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8fb88f]">resume</div>
                <div className="mt-3 text-[14px] text-[#f2f2f3]">{card.title}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-[#16161a] pt-14">
          <SectionHeading
            index="28"
            file="challenges.md"
            title={isCodeCollab ? "Things that broke, things I learned." : "What this project taught me."}
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {challengeCards.map((card) => (
              <div key={card.title} className="border-l-2 border-[#ffddc0] bg-[#101114] p-5">
                <div className="text-[14px] text-[#f2f2f3]">{card.title}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-[#16161a] pt-10 text-[12px] text-[#7c7c85]">
          <div className="mb-4 flex items-center gap-2 text-[#5d5d65]">
            <span className="text-[#8f8f96]">&gt;</span>
            <span>git log --oneline ~/projects</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Link
              href={`/projects/${previousProject.id}`}
              className="group border border-[#1f1f24] bg-[#101114] p-5 transition-colors duration-200 hover:border-[#ffddc0]"
            >
              <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#7c7c85]">
                previous
              </div>
              <div className="text-[15px] text-[#f2f2f3] transition-colors duration-200 group-hover:text-[#ffddc0]">
                {previousProject.name}
              </div>
              <div className="mt-1 text-[13px] leading-relaxed text-[#a8a8ad]">
                {previousProject.excerpt}
              </div>
            </Link>

            <Link
              href={`/projects/${nextProject.id}`}
              className="group border border-[#1f1f24] bg-[#101114] p-5 text-right transition-colors duration-200 hover:border-[#ffddc0]"
            >
              <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#7c7c85]">
                next
              </div>
              <div className="text-[15px] text-[#f2f2f3] transition-colors duration-200 group-hover:text-[#ffddc0]">
                {nextProject.name}
              </div>
              <div className="mt-1 text-[13px] leading-relaxed text-[#a8a8ad]">
                {nextProject.excerpt}
              </div>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#16161a] pt-6">
            <Link href="/#projects" className="transition-colors duration-200 hover:text-[#ffddc0]">
              back to projects section
            </Link>
            <div className="flex flex-wrap gap-4">
              <span>~/projects/{project.id}</span>
              <span>last updated {project.date}</span>
              <span>shivanirai08.me © 2025</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}