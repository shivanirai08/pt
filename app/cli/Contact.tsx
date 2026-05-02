"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal, socials } from "../data";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const CLI_CONNECTION_LINES = [
  "Connecting to shivani.dev...",
  "Verifying host key...",
  "Authenticating...",
] as const;
const CLI_CONNECTION_INITIAL_DELAY_MS = 220;
const CLI_CONNECTION_STEP_MS = 440;
const CLI_CONNECTION_REVEAL_DELAY_MS = 260;

type Step = 0 | 1 | 2 | 3;
const STEP_KEYS = ["name", "email", "topic", "message"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const STEP_HINT: Record<StepKey, string> = {
  name: "your name",
  email: "your email address",
  topic: "e.g. project · freelance · fulltime · other",
  message: "your message — ↵↵ to send, esc to cancel",
};

type FormValues = Record<StepKey, string>;

const CONTACT_LINKS = [
  { label: "email", value: personal.email, href: `mailto:${personal.email}` },
  { label: "twitter", value: "@shivanirai_", href: socials.find((s) => s.name === "twitter")?.url ?? "#" },
  { label: "linkedin", value: "linkedin.com/in/shivanirai", href: socials.find((s) => s.name === "linkedin")?.url ?? "#" },
];

export default function CLIContact() {
  const [connectionPhase, setConnectionPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [values, setValues] = useState<FormValues>({ name: "", email: "", topic: "", message: "" });
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastEnterAt, setLastEnterAt] = useState<number | null>(null);
  const [emailError, setEmailError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    setConnectionPhase(0);
    setShowContent(false);
    CLI_CONNECTION_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setConnectionPhase(i + 1), CLI_CONNECTION_INITIAL_DELAY_MS + i * CLI_CONNECTION_STEP_MS));
    });
    const revealAt = CLI_CONNECTION_INITIAL_DELAY_MS + CLI_CONNECTION_LINES.length * CLI_CONNECTION_STEP_MS + CLI_CONNECTION_REVEAL_DELAY_MS;
    timers.push(setTimeout(() => setShowContent(true), revealAt));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!showContent || submitted) return;
    if (currentStep < 3) inputRef.current?.focus();
    else textareaRef.current?.focus();
  }, [showContent, currentStep, submitted]);

  const advance = () => {
    const key = STEP_KEYS[currentStep];
    if (!draft.trim()) return;
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.trim())) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setValues((prev) => ({ ...prev, [key]: draft.trim() }));
    setDraft("");
    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step);
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); advance(); }
    if (e.key === "Escape") { e.preventDefault(); handleCancel(); }
    if (e.key !== "Enter") setEmailError(false);
  };

  const handleMessageKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const now = Date.now();
      if (lastEnterAt !== null && now - lastEnterAt < 500) { e.preventDefault(); handleSend(); }
      else setLastEnterAt(now);
    } else { setLastEnterAt(null); }
    if (e.key === "Escape") { e.preventDefault(); handleCancel(); }
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    setValues((prev) => ({ ...prev, message: draft.trim() }));
    setSubmitted(true);
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setDraft("");
    setValues({ name: "", email: "", topic: "", message: "" });
    setSubmitted(false);
    setLastEnterAt(null);
    setEmailError(false);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto max-w-[960px] text-[13.5px] leading-[1.75]">
      {/* SSH header — same style as other sections */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-6 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">ssh</span>
        <span className="text-[#a8a8ad]">connect@shivani.dev</span>
      </motion.div>

      {/* Connection animation */}
      {!showContent && (
        <motion.div variants={fadeUp} className="mb-8 space-y-2 text-[12.5px]">
          {CLI_CONNECTION_LINES.map((line, index) => {
            const isVisible = connectionPhase >= index + 1;
            const isActive = connectionPhase === index + 1;
            return (
              <div
                key={line}
                className={
                  "flex items-center gap-3 transition-all duration-300 " +
                  (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")
                }
              >
                <span className="flex-1 text-[#a8a8ad]">{line}</span>
                {isVisible && <span className="text-[#8fb88f]">OK</span>}
                {isActive && <span className="inline-block h-[14px] w-[8px] animate-pulse bg-[#ffddc0]" />}
              </div>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {showContent && (
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* REACH section */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] font-medium mb-2">REACH</div>
              <div className="pl-6 space-y-1">
                {CONTACT_LINKS.map((link) => (
                  <div key={link.label} className="flex items-center gap-3">
                    <span className="w-[64px] text-[#d4b483]">{link.label}</span>
                    <span className="text-[#4a4a52]">=</span>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
                    >
                      {link.value}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* STATUS section */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] font-medium mb-2">STATUS</div>
              <div className="pl-6 space-y-1 text-[13px]">
                <div className="flex gap-3">
                  <span className="text-[#d4b483] w-[120px]">$RESPONSE</span>
                  <span className="text-[#4a4a52]">=</span>
                  <span className="text-[#a8a8ad]">{personal.responseTime}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#d4b483] w-[120px]">$TIMEZONE</span>
                  <span className="text-[#4a4a52]">=</span>
                  <span className="text-[#a8a8ad]">{personal.timezone}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#d4b483] w-[120px]">$AVAILABLE</span>
                  <span className="text-[#4a4a52]">=</span>
                  <span className="text-[#a8a8ad]">{personal.availability}</span>
                </div>
              </div>
            </motion.div>

            {/* COMPOSE section */}
            <motion.div variants={fadeUp}>
              <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] font-medium mb-3">COMPOSE</div>
              <div className="pl-6">
                {!submitted ? (
                  <>
                    {/* $ msg header */}
                    <div className="mb-4 text-[12.5px]">
                      <span className="text-[#7c7c85]">$ </span>
                      <span className="text-[#e8e8ea]">msg</span>
                      <span className="text-[#a8a8ad]"> --new --to </span>
                      <span className="text-[#d4b483]">{personal.email}</span>
                    </div>

                    {/* Completed fields */}
                    <div className="mb-2 space-y-1.5 text-[13px]">
                      {STEP_KEYS.map((key, i) => {
                        if (i >= currentStep || !values[key]) return null;
                        return (
                          <div key={key} className="flex items-baseline gap-3">
                            <span className="text-[#8fb88f]">✓</span>
                            <span className="w-[56px] text-[#7c7c85]">{key}</span>
                            <span className="text-[#e8e8ea]">{values[key]}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active inline prompt (steps 0-2) */}
                    {currentStep < 3 && (
                      <div className="mb-1">
                        <div className="flex items-center gap-3 text-[13px]">
                          <span className="text-[#d4b483]">?</span>
                          <span className="w-[56px] text-[#ffddc0]">{STEP_KEYS[currentStep]}</span>
                          <input
                            ref={inputRef}
                            type={currentStep === 1 ? "email" : "text"}
                            value={draft}
                            onChange={(e) => { setDraft(e.target.value); setEmailError(false); }}
                            onKeyDown={handleInlineKeyDown}
                            autoComplete="off"
                            spellCheck={false}
                            className="flex-1 bg-transparent text-[#e8e8ea] caret-[#ffddc0] outline-none"
                          />
                          <span className="inline-block h-[14px] w-[7px] animate-pulse bg-[#ffddc0] opacity-80" />
                        </div>
                        {emailError && (
                          <div className="mt-1 pl-[76px] text-[11.5px] text-[#c27070]">
                            invalid email address
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message textarea (step 3) */}
                    {currentStep === 3 && (
                      <div className="mb-4">
                        <div className="flex items-start gap-3 text-[13px] mb-2">
                          <span className="text-[#d4b483] mt-[3px]">?</span>
                          <span className="w-[56px] text-[#ffddc0]">message</span>
                          <span className="text-[11px] text-[#4a4a52] mt-[2px]">markdown ok · ↵↵ to send · esc to cancel</span>
                        </div>
                        <textarea
                          ref={textareaRef}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={handleMessageKeyDown}
                          rows={5}
                          spellCheck={false}
                          placeholder="write your message..."
                          className="w-full resize-none border border-[#1e1e22] bg-[#0d0d10] px-3 py-2.5 text-[13px] text-[#e8e8ea] caret-[#ffddc0] outline-none transition-colors placeholder:text-[#3a3a40] focus:border-[#d4b483]/40"
                        />
                        <div className="mt-3 flex items-center gap-3">
                          <button onClick={handleSend} className="cursor-pointer border border-[#d4b483]/40 px-4 py-1.5 text-[12px] text-[#d4b483] transition-colors hover:border-[#d4b483] hover:bg-[#d4b483]/10">
                            [ ↵ send ]
                          </button>
                          <button onClick={handleCancel} className="cursor-pointer border border-[#242428] px-4 py-1.5 text-[12px] text-[#7c7c85] transition-colors hover:border-[#4a4a52] hover:text-[#a8a8ad]">
                            [ esc cancel ]
                          </button>
                        </div>
                      </div>
                    )}

                    {/* <div className="mt-5 text-[11px] text-[#4a4a52]">
                      // privacy: goes straight to my inbox · no third-party form service · no tracking
                    </div> */}
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2 text-[13px]">
                    <div className="flex gap-3">
                      <span className="text-[#8fb88f]">✓</span>
                      <span className="text-[#a8a8ad]">
                        message sent to <span className="text-[#d4b483]">{personal.email}</span>
                      </span>
                    </div>
                    <div className="text-[#7c7c85] pl-5">
                      reply expected within {personal.responseTime}
                    </div>
                    <button onClick={handleCancel} className="cursor-pointer mt-3 border border-[#242428] px-4 py-1.5 text-[12px] text-[#7c7c85] transition-colors hover:border-[#4a4a52] hover:text-[#a8a8ad]">
                      [ send another ]
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
