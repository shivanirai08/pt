import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  GitBranch,
  Link2,
  MessageSquareQuote,
  Mic,
  MousePointer2,
  RefreshCw,
  Shield,
  Smartphone,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { projects, personal, type Project } from "../../data";
import {
  projectDetails,
  type ProjectDetailContent,
  type ProjectFeatureCard,
  type ProjectMetric,
} from "../../projectDetails";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

type ContentCard = {
  title: string;
  body: string;
};

type FeatureCard = ContentCard & {
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  iconLabel: string;
};

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cursor: MousePointer2,
  mic: Mic,
  message: MessageSquareQuote,
  git: GitBranch,
  users: Users,
  link: Link2,
  trophy: Trophy,
  timer: Timer,
  shield: Shield,
  cpu: Cpu,
  refresh: RefreshCw,
  smartphone: Smartphone,
};

function getStatusLabel(project: Project) {
  if (project.status === "live") return "v1.2 - shipped";
  if (project.status === "wip") return "v0.9 - in progress";
  return "v0.8 - archived";
}

function buildFallbackDetail(project: Project): ProjectDetailContent {
  const name = project.name.replace("feat: ", "");
  return {
    heroMetrics: [
      { label: "ROLE", value: project.role },
      { label: "TIMELINE", value: project.date },
      { label: "STATUS", value: getStatusLabel(project) },
      { label: "SCOPE", value: String(project.stack.length) },
    ],
    browserBar: `${project.id}.app`,
    heroPlaceholder: `[ hero product screenshot - ${name} ]`,
    lastUpdated: project.date,
    sections: {
      problem: {
        title: `Why ${name} exists.`,
        body: project.description,
        metrics: [
          { label: "stack items", value: String(project.stack.length) },
          { label: "highlights", value: String(project.highlights.length) },
          { label: "live links", value: String(project.links.length) },
        ],
      },
      solution: {
        title: `What ${name} delivers.`,
        body: project.excerpt,
        beforeItems: ["Scattered tools", "Manual workflows", "Slow setup", "No shared state"],
        beforeNote: "Multiple surfaces, high friction",
        afterUrl: `${project.id}.app`,
        afterNote: "One product, one flow",
      },
      approach: {
        title: `How ${name} was built.`,
        steps: project.highlights.map((highlight, index) => [
          `step 0${index + 1}`,
          `Highlight ${index + 1}`,
          highlight,
        ] as [string, string, string]),
      },
      architecture: {
        title: "Stack and structure.",
        clientLabel: `Client (${project.stack[0] ?? "App"})`,
        middleLabel: "API Layer",
        middleConnector: "| ▲ data | ▲ sync |",
        footerNote: `${project.stack.join(" · ")}`,
        cards: project.stack.slice(0, 6).map((item) => ({
          title: item,
          body: `Used across ${name}.`,
        })),
      },
      features: {
        title: "Key capabilities.",
        cards: project.highlights.map((highlight, index) => ({
          title: `Feature ${index + 1}`,
          body: highlight,
          iconKey: "cursor",
          accent: "#8fb88f",
          iconLabel: "feature",
        })),
      },
      decisions: {
        title: "Decisions worth defending.",
        rows: project.highlights.map((highlight, index) => ({
          title: `Decision ${index + 1}`,
          body: highlight,
        })),
      },
      skills: {
        title: "What I stretched on this one.",
        cards: project.stack.map((item) => ({
          title: item,
          body: `Primary technology shaping ${name}.`,
        })),
      },
      challenges: {
        title: "Things that broke, things I learned.",
        cards: project.highlights.slice(0, 3).map((highlight, index) => ({
          title: `Challenge ${index + 1}`,
          body: highlight,
        })),
      },
    },
  };
}

function toFeatureCards(cards: ProjectFeatureCard[]): FeatureCard[] {
  return cards.map((card) => ({
    title: card.title,
    body: card.body,
    icon: featureIcons[card.iconKey] ?? MousePointer2,
    accent: card.accent,
    iconLabel: card.iconLabel,
  }));
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

function StatTile({ label, value }: ProjectMetric) {
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
  const detail = projectDetails[project.id] ?? buildFallbackDetail(project);
  const { sections } = detail;
  const featureCards = toFeatureCards(sections.features.cards);

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
            <span className="border border-[#2f2f35] bg-[#0f1013] px-2 py-0.5 text-[#8fb88f]">{project.date}</span>
            {project.head ? (
              <span className="border border-[#2f2f35] bg-[#0f1013] px-2 py-0.5 text-[#8fb88f]">HEAD</span>
            ) : null}
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
              <span className="ml-2 text-[12px] text-[#72727a]">{detail.browserBar}</span>
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
                  {detail.heroPlaceholder}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 border-t border-[#16161a] pt-10 sm:grid-cols-2 xl:grid-cols-4">
          {detail.heroMetrics.map((metric) => (
            <StatTile key={metric.label} {...metric} />
          ))}
        </section>

        <SectionShell
          index="01"
          file="problem.md"
          title={sections.problem.title}
          body={sections.problem.body}
        >
          {sections.problem.quote ? (
            <div className="border-l border-[#2f2f35] pl-5 italic text-[13px] leading-relaxed text-[#777780] sm:text-[14px]">
              &ldquo;{sections.problem.quote}&rdquo;
            </div>
          ) : null}

          <div className={`grid gap-4 md:grid-cols-3 ${sections.problem.quote ? "mt-8" : ""}`}>
            {sections.problem.metrics.map((metric) => (
              <StatTile key={metric.label} {...metric} />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          index="02"
          file="solution.md"
          title={sections.solution.title}
          body={sections.solution.body}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <Panel className="p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#7c7c85]">before</div>
              <div className="mt-4 space-y-1.5 text-[14px] leading-relaxed text-[#d7d7dd]">
                {sections.solution.beforeItems.map((item) => (
                  <div key={item}>{item}</div>
                ))}
                <div className="pt-4 text-[12px] text-[#73737b]">- {sections.solution.beforeNote}</div>
              </div>
            </Panel>

            <Panel className="border-[#234328] bg-[#101c10] p-5 text-[#d9f1d9]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#8fb88f]">after</div>
              <div className="mt-4 space-y-4">
                <div className="font-mono text-[14px]">{sections.solution.afterUrl}</div>
                <div className="font-mono text-[13px] text-[#8fb88f]">- {sections.solution.afterNote}</div>
              </div>
            </Panel>
          </div>
        </SectionShell>

        <SectionShell index="03" file="approach.md" title={sections.approach.title}>
          <div className="grid gap-0 border-l border-[#1f1f24]">
            {sections.approach.steps.map(([step, title, body], index) => (
              <div key={step} className={`grid gap-4 border-b border-dashed border-[#1d1d22] py-6 last:border-b-0 lg:grid-cols-[160px_1fr] ${index === 0 ? "pt-0" : ""}`}>
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#8fb88f]">{step}</div>
                <div>
                  <div className="text-[15px] text-[#f2f2f3]">{title}</div>
                  <div className="mt-2 max-w-4xl text-[13px] leading-relaxed text-[#a8a8ad]">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="04" file="architecture.md" title={sections.architecture.title}>
          <div className="rounded border border-[#1f1f24] bg-[#0f1013] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="mx-auto mb-7 w-fit border border-[#777780] border-b-0 px-10 py-1 text-[12px] text-[#d7d7dd]">
                {sections.architecture.clientLabel}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {sections.architecture.cards.slice(0, 3).map((card) => (
                  <div key={card.title} className="border border-[#2a2a30] bg-[#111114] px-5 py-4 text-center">
                    <div className="text-[14px] text-[#d8d8de]">{card.title}</div>
                    <div className="mt-1 text-[12px] text-[#767680]">{card.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 text-center text-[12px] text-[#6d6d74]">{sections.architecture.middleConnector}</div>
              <div className="mx-auto mt-3 w-fit border border-[#777780] border-b-0 px-9 py-1 text-[12px] text-[#d7d7dd]">
                {sections.architecture.middleLabel}
              </div>

              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {sections.architecture.cards.slice(3).map((card) => (
                  <div key={card.title} className="border border-[#2a2a30] bg-[#111114] px-5 py-4 text-center">
                    <div className="text-[14px] text-[#d8d8de]">{card.title}</div>
                    <div className="mt-1 text-[12px] text-[#767680]">{card.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-[12px] leading-relaxed text-[#66666d]">
                {sections.architecture.footerNote}
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell index="05" file="features.md" title={sections.features.title}>
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

        <SectionShell index="06" file="design-choices.md" title={sections.decisions.title}>
          <div className="overflow-hidden border border-[#1f1f24] bg-[#101114]">
            {sections.decisions.rows.map((card, index) => (
              <div
                key={card.title}
                className={`grid gap-4 px-5 py-4 lg:grid-cols-[280px_1fr] ${index !== sections.decisions.rows.length - 1 ? "border-b border-[#1b1b20]" : ""}`}
              >
                <div className="text-[13px] text-[#ececef]">{card.title}</div>
                <div className="text-[13px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="07" file="skills.md" title={sections.skills.title}>
          <div className="grid gap-4 md:grid-cols-2">
            {sections.skills.cards.map((card) => (
              <div key={card.title} className="border border-[#1f1f24] bg-[#101114] p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8fb88f]">{card.title}</div>
                <div className="mt-3 text-[14px] leading-relaxed text-[#a8a8ad]">{card.body}</div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell index="08" file="challenges.md" title={sections.challenges.title}>
          <div className="overflow-hidden border border-[#1f1f24] bg-[#101114]">
            {sections.challenges.cards.map((card, index) => (
              <div
                key={card.title}
                className={`grid gap-4 px-5 py-4 lg:grid-cols-[280px_1fr] ${index !== sections.challenges.cards.length - 1 ? "border-b border-[#1b1b20]" : ""}`}
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
              <span>last updated {detail.lastUpdated}</span>
              <span>shivanirai08.me © 2025</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
