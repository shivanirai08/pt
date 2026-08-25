"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Experience,
  PortfolioContent,
  Project,
  SkillProcessRow,
  Social,
  StackRow,
} from "../types/portfolio";

type Tab = "personal" | "about" | "projects" | "experience" | "skills" | "socials";

const TABS: { id: Tab; label: string }[] = [
  { id: "personal", label: "Personal" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "socials", label: "Socials" },
];

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded border border-[#2a2a30] bg-[#0d0d10] px-3 py-2 text-sm text-[#e8e8ea] outline-none focus:border-[#ffddc0]";
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-wider text-[#7c7c85]">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${className} min-h-[96px] resize-y`}
        />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={className} />
      )}
    </label>
  );
}

function emptyProject(): Project {
  return {
    id: `project-${Date.now()}`,
    name: "feat: New Project",
    image: "/projects/placeholder.png",
    date: "2026",
    dateSort: 20260101,
    excerpt: "",
    description: "",
    stack: [],
    role: "Software Developer",
    status: "live",
    links: [{ label: "Live", url: "" }],
    highlights: [""],
  };
}

function emptyExperience(): Experience {
  return {
    version: `v0.${Date.now()}`,
    range: "Jan 2026 – Present",
    role: "Software Developer",
    company: "Company Name",
    achievements: [""],
  };
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("personal");
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSession = useCallback(async () => {
    const sessionRes = await fetch("/api/admin/session");
    const session = (await sessionRes.json()) as { authenticated: boolean };
    if (!session.authenticated) {
      setAuthenticated(false);
      return;
    }
    setAuthenticated(true);
    const contentRes = await fetch("/api/admin");
    if (contentRes.ok) {
      setContent((await contentRes.json()) as PortfolioContent);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setLoginError(data.error ?? "Login failed");
      return;
    }
    setPassword("");
    await loadSession();
  };

  const logout = async () => {
    await fetch("/api/admin", { method: "DELETE" });
    setAuthenticated(false);
    setContent(null);
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setStatus(null);
    const res = await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) setStatus("Saved — refresh the portfolio to see changes.");
    else setStatus("Save failed. Check server logs.");
  };

  const updatePersonal = (key: keyof PortfolioContent["personal"], value: string) => {
    setContent((prev) => (prev ? { ...prev, personal: { ...prev.personal, [key]: value } } : prev));
  };

  const updateStackRow = (index: number, patch: Partial<StackRow>) => {
    setContent((prev) => {
      if (!prev) return prev;
      const aboutStack = prev.aboutStack.map((row, i) => (i === index ? { ...row, ...patch } : row));
      return { ...prev, aboutStack };
    });
  };

  const updateProject = (index: number, patch: Partial<Project>) => {
    setContent((prev) => {
      if (!prev) return prev;
      const projects = prev.projects.map((p, i) => (i === index ? { ...p, ...patch } : p));
      return { ...prev, projects };
    });
  };

  const updateExperience = (index: number, patch: Partial<Experience>) => {
    setContent((prev) => {
      if (!prev) return prev;
      const experience = prev.experience.map((e, i) => (i === index ? { ...e, ...patch } : e));
      return { ...prev, experience };
    });
  };

  const updateSkillRow = (index: number, patch: Partial<SkillProcessRow>) => {
    setContent((prev) => {
      if (!prev) return prev;
      const skillProcessRows = prev.skillProcessRows.map((row, i) =>
        i === index ? { ...row, ...patch } : row
      );
      return { ...prev, skillProcessRows };
    });
  };

  const updateSocial = (index: number, patch: Partial<Social>) => {
    setContent((prev) => {
      if (!prev) return prev;
      const socials = prev.socials.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...prev, socials };
    });
  };

  if (authenticated === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0b] text-[#7c7c85]">
        Checking session…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0b] px-4">
        <form
          onSubmit={login}
          className="w-full max-w-md space-y-5 rounded border border-[#242428] bg-[#111114] p-8"
        >
          <div>
            <h1 className="text-lg font-semibold text-[#e8e8ea]">Portfolio Admin</h1>
            <p className="mt-1 text-sm text-[#7c7c85]">Enter the password from your <code className="text-[#ffddc0]">.env</code> file.</p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-[#7c7c85]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-[#2a2a30] bg-[#0d0d10] px-3 py-2 text-sm text-[#e8e8ea] outline-none focus:border-[#ffddc0]"
            />
          </label>
          {loginError ? <p className="text-sm text-[#f85149]">{loginError}</p> : null}
          <button
            type="submit"
            className="w-full border border-[#ffddc0] bg-[#ffddc0] py-2.5 text-sm font-medium text-[#0a0a0b] hover:bg-[#e8e8ea]"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0b] text-[#7c7c85]">
        Loading content…
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0a0a0b] text-[#e8e8ea]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#242428] bg-[#0a0a0b]/95 px-6 py-4 backdrop-blur">
        <div>
          <h1 className="text-base font-semibold">Portfolio Admin</h1>
          <p className="text-xs text-[#7c7c85]">Edit content · saved to content/portfolio.json</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-[#c3c7f4] hover:text-white">
            View site
          </a>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="border border-[#ffddc0] px-4 py-2 text-sm text-[#ffddc0] hover:bg-[#ffddc0] hover:text-[#0a0a0b] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button type="button" onClick={() => void logout()} className="text-sm text-[#7c7c85] hover:text-white">
            Log out
          </button>
        </div>
      </header>

      {status ? (
        <div className="border-b border-[#242428] bg-[#111114] px-6 py-2 text-sm text-[#3fb950]">{status}</div>
      ) : null}

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <nav className="flex w-40 shrink-0 flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                "rounded px-3 py-2 text-left text-sm transition-colors " +
                (tab === t.id ? "bg-[#111114] text-[#ffddc0]" : "text-[#7c7c85] hover:text-[#e8e8ea]")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          {tab === "personal" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={content.personal.name} onChange={(v) => updatePersonal("name", v)} />
              <Field label="Full name" value={content.personal.fullName} onChange={(v) => updatePersonal("fullName", v)} />
              <Field label="Role" value={content.personal.role} onChange={(v) => updatePersonal("role", v)} />
              <Field label="Email" value={content.personal.email} onChange={(v) => updatePersonal("email", v)} />
              <Field
                label="Resume URL"
                value={content.personal.resumeUrl}
                onChange={(v) => updatePersonal("resumeUrl", v)}
              />
              <Field label="Tagline" value={content.personal.tagline} onChange={(v) => updatePersonal("tagline", v)} />
              <Field label="Location" value={content.personal.location} onChange={(v) => updatePersonal("location", v)} />
              <div className="sm:col-span-2">
                <Field label="Intro" value={content.personal.intro} onChange={(v) => updatePersonal("intro", v)} multiline />
              </div>
              <div className="sm:col-span-2">
                <Field label="Description" value={content.personal.description} onChange={(v) => updatePersonal("description", v)} multiline />
              </div>
              <div className="sm:col-span-2">
                <Field label="Bio" value={content.personal.bio} onChange={(v) => updatePersonal("bio", v)} multiline />
              </div>
            </div>
          )}

          {tab === "about" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-[#ffddc0]">Stack rows</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) =>
                        prev ? { ...prev, aboutStack: [...prev.aboutStack, { label: "new/", items: "" }] } : prev
                      )
                    }
                    className="text-xs text-[#c3c7f4] hover:text-white"
                  >
                    + Add row
                  </button>
                </div>
                {content.aboutStack.map((row, i) => (
                  <div key={i} className="grid gap-3 rounded border border-[#242428] p-4 sm:grid-cols-2">
                    <Field label="Label" value={row.label} onChange={(v) => updateStackRow(i, { label: v })} />
                    <Field label="Items" value={row.items} onChange={(v) => updateStackRow(i, { items: v })} />
                  </div>
                ))}
              </div>
              <Field
                label="Philosophy (one per line)"
                value={content.aboutPhilosophy.join("\n")}
                onChange={(v) => setContent((prev) => (prev ? { ...prev, aboutPhilosophy: v.split("\n").filter(Boolean) } : prev))}
                multiline
              />
            </div>
          )}

          {tab === "projects" && (
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => setContent((prev) => (prev ? { ...prev, projects: [emptyProject(), ...prev.projects] } : prev))}
                className="text-sm text-[#c3c7f4] hover:text-white"
              >
                + Add project
              </button>
              {content.projects.map((project, i) => (
                <div key={project.id} className="space-y-4 rounded border border-[#242428] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#ffddc0]">{project.name || "Untitled project"}</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) =>
                          prev ? { ...prev, projects: prev.projects.filter((_, idx) => idx !== i) } : prev
                        )
                      }
                      className="text-xs text-[#f85149] hover:text-[#ff9a94]"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="ID (slug)" value={project.id} onChange={(v) => updateProject(i, { id: v })} />
                    <Field label="Name" value={project.name} onChange={(v) => updateProject(i, { name: v })} />
                    <Field label="Date" value={project.date} onChange={(v) => updateProject(i, { date: v })} />
                    <Field label="Role" value={project.role} onChange={(v) => updateProject(i, { role: v })} />
                    <Field label="Image path" value={project.image} onChange={(v) => updateProject(i, { image: v })} />
                    <Field
                      label="Status"
                      value={project.status}
                      onChange={(v) => updateProject(i, { status: v as Project["status"] })}
                    />
                  </div>
                  <Field label="Excerpt" value={project.excerpt} onChange={(v) => updateProject(i, { excerpt: v })} multiline />
                  <Field label="Description" value={project.description} onChange={(v) => updateProject(i, { description: v })} multiline />
                  <Field
                    label="Stack (comma-separated)"
                    value={project.stack.join(", ")}
                    onChange={(v) => updateProject(i, { stack: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                  />
                  <Field
                    label="Highlights (one per line)"
                    value={project.highlights.join("\n")}
                    onChange={(v) => updateProject(i, { highlights: v.split("\n").filter(Boolean) })}
                    multiline
                  />
                  <Field
                    label="Links (label|url per line)"
                    value={project.links.map((l) => `${l.label}|${l.url}`).join("\n")}
                    onChange={(v) =>
                      updateProject(i, {
                        links: v
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => {
                            const [label, url] = line.split("|");
                            return { label: (label ?? "").trim(), url: (url ?? "").trim() };
                          }),
                      })
                    }
                    multiline
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "experience" && (
            <div className="space-y-6">
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => (prev ? { ...prev, experience: [emptyExperience(), ...prev.experience] } : prev))
                }
                className="text-sm text-[#c3c7f4] hover:text-white"
              >
                + Add role
              </button>
              {content.experience.map((exp, i) => (
                <div key={exp.version + i} className="space-y-4 rounded border border-[#242428] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#ffddc0]">{exp.role}</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) =>
                          prev ? { ...prev, experience: prev.experience.filter((_, idx) => idx !== i) } : prev
                        )
                      }
                      className="text-xs text-[#f85149] hover:text-[#ff9a94]"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Version" value={exp.version} onChange={(v) => updateExperience(i, { version: v })} />
                    <Field label="Range" value={exp.range} onChange={(v) => updateExperience(i, { range: v })} />
                    <Field label="Role" value={exp.role} onChange={(v) => updateExperience(i, { role: v })} />
                    <Field label="Company" value={exp.company} onChange={(v) => updateExperience(i, { company: v })} />
                  </div>
                  <Field
                    label="Achievements (one per line)"
                    value={exp.achievements.join("\n")}
                    onChange={(v) => updateExperience(i, { achievements: v.split("\n").filter(Boolean) })}
                    multiline
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "skills" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  setContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          skillProcessRows: [
                            ...prev.skillProcessRows,
                            { pid: "00", skill: "--new", years: "0y 00m", projects: "-", state: "LEARNING" },
                          ],
                        }
                      : prev
                  )
                }
                className="text-sm text-[#c3c7f4] hover:text-white"
              >
                + Add skill row
              </button>
              {content.skillProcessRows.map((row, i) => (
                <div key={row.pid + i} className="grid gap-3 rounded border border-[#242428] p-4 sm:grid-cols-5">
                  <Field label="PID" value={row.pid} onChange={(v) => updateSkillRow(i, { pid: v })} />
                  <Field label="Skill" value={row.skill} onChange={(v) => updateSkillRow(i, { skill: v })} />
                  <Field label="Years" value={row.years} onChange={(v) => updateSkillRow(i, { years: v })} />
                  <Field label="Projects" value={row.projects} onChange={(v) => updateSkillRow(i, { projects: v })} />
                  <Field label="State" value={row.state} onChange={(v) => updateSkillRow(i, { state: v as SkillProcessRow["state"] })} />
                </div>
              ))}
            </div>
          )}

          {tab === "socials" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  setContent((prev) =>
                    prev ? { ...prev, socials: [...prev.socials, { name: "new", handle: "", url: "" }] } : prev
                  )
                }
                className="text-sm text-[#c3c7f4] hover:text-white"
              >
                + Add social
              </button>
              {content.socials.map((social, i) => (
                <div key={i} className="grid gap-3 rounded border border-[#242428] p-4 sm:grid-cols-3">
                  <Field label="Name" value={social.name} onChange={(v) => updateSocial(i, { name: v })} />
                  <Field label="Handle" value={social.handle} onChange={(v) => updateSocial(i, { handle: v })} />
                  <Field label="URL" value={social.url} onChange={(v) => updateSocial(i, { url: v })} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
