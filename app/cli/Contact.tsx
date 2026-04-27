"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal, socials } from "../data";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
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

const STEP_PROMPTS: Record<StepKey, string> = {
  name: "name",
  email: "email",
  topic: "topic",
  message: "message  (markdown ok · ↵↵ to finish)",
};

const CONTACT_LINKS = [
  {
    label: "email",
    value: personal.email,
    href: `mailto:${personal.email}`,
  },
  {
    label: "twitter",
    value: "@shivanirai_",
    href: socials.find((s) => s.name === "twitter")?.url ?? "#",
  },
  {
    label: "linkedin",
    value: "linkedin.com/in/shivanirai",
    href: socials.find((s) => s.name === "linkedin")?.url ?? "#",
  },
];

type FormValues = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export default function CLIContact() {
  const [connectionPhase, setConnectionPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastEnterAt, setLastEnterAt] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // SSH animation on mount
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    setConnectionPhase(0);
    setShowContent(false);

    CLI_CONNECTION_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setConnectionPhase(i + 1),
          CLI_CONNECTION_INITIAL_DELAY_MS + i * CLI_CONNECTION_STEP_MS
        )
      );
    });

    const revealAt =
      CLI_CONNECTION_INITIAL_DELAY_MS +
      CLI_CONNECTION_LINES.length * CLI_CONNECTION_STEP_MS +
      CLI_CONNECTION_REVEAL_DELAY_MS;

    timers.push(setTimeout(() => setShowContent(true), revealAt));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-focus active input/textarea
  useEffect(() => {
    if (!showContent || submitted) return;
    if (currentStep < 3) {
      inputRef.current?.focus();
    } else {
      textareaRef.current?.focus();
    }
  }, [showContent, currentStep, submitted]);

  const advance = () => {
    const key = STEP_KEYS[currentStep];
    if (!draft.trim()) return;
    setValues((prev) => ({ ...prev, [key]: draft.trim() }));
    setDraft("");
    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step);
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); advance(); }
  };

  const handleMessageKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const now = Date.now();
      if (lastEnterAt !== null && now - lastEnterAt < 500) {
        e.preventDefault();
        handleSend();
      } else {
        setLastEnterAt(now);
      }
    } else {
      setLastEnterAt(null);
    }
    if (e.key === "Escape") { e.preventDefault(); handleCancel(); }
  };

  const handleSend = () => {
    if (currentStep === 3 && !draft.trim()) return;
    if (currentStep === 3) setValues((prev) => ({ ...prev, message: draft.trim() }));
    setSubmitted(true);
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setDraft("");
    setValues({ name: "", email: "", topic: "", message: "" });
    setSubmitted(false);
    setLastEnterAt(null);
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-[700px] text-[13px]"
    >
      {/* SSH header */}
      <motion.div
        variants={fadeUp}
        className="mb-6 flex items-center gap-2 border-b border-[#16161a] pb-4 text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">ssh</span>
        <span className="text-[#a8a8ad]">connect@shivani.dev</span>
      </motion.div>

      {/* Connection logs */}
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
                {isActive && (
                  <span className="inline-block h-[14px] w-[8px] animate-pulse bg-[#ffddc0]" />
                )}
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Main contact content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* > contact */}
            <div className="mb-6 text-[13px]">
              <span className="text-[#7c7c85]">&gt; </span>
              <span className="text-[#e8e8ea]">contact</span>
            </div>

            {/* Static links */}
            <div className="mb-8">
              <div className="mb-3 text-[11px] text-[#4a4a52] tracking-[0.12em]">
                ## prefer the static version?
              </div>
              <div className="space-y-1.5">
                {CONTACT_LINKS.map((link) => (
                  <div key={link.label} className="flex items-center gap-3">
                    <span className="text-[#4a4a52]">→</span>
                    <span className="w-[68px] text-[#7c7c85]">{link.label}</span>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="text-[#d4b483] underline underline-offset-2 decoration-[#d4b483]/40 hover:text-[#ffddc0] transition-colors"
                    >
                      {link.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Compose form */}
            {!submitted ? (
              <div>
                <div className="mb-4 text-[11px] text-[#4a4a52] tracking-[0.12em]">
                  ## or, compose here
                </div>

                {/* $ msg --new --to */}
                <div className="mb-5 text-[12.5px]">
                  <span className="text-[#7c7c85]">$ </span>
                  <span className="text-[#e8e8ea]">msg</span>
                  <span className="text-[#a8a8ad]"> --new --to </span>
                  <span className="text-[#d4b483]">{personal.email}</span>
                </div>

                {/* Completed steps */}
                <div className="mb-3 space-y-2">
                  {STEP_KEYS.map((key, i) => {
                    if (i >= currentStep || !values[key]) return null;
                    return (
                      <div key={key} className="flex items-baseline gap-3 text-[12.5px]">
                        <span className="text-[#8fb88f]">✓</span>
                        <span className="w-[60px] text-[#7c7c85]">{key}</span>
                        <span className="text-[#e8e8ea]">{values[key]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Active step */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center gap-3 text-[12.5px]">
                    <span className="text-[#d4b483]">?</span>
                    <span className="font-medium text-[#ffddc0]">
                      {STEP_PROMPTS[STEP_KEYS[currentStep]]}
                    </span>
                  </div>

                  {currentStep < 3 ? (
                    <input
                      ref={inputRef}
                      type={currentStep === 1 ? "email" : "text"}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={handleInlineKeyDown}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="type and press ↵"
                      className="w-full border border-[#242428] bg-transparent px-3 py-2.5 text-[13px] text-[#e8e8ea] caret-[#ffddc0] outline-none transition-colors placeholder:text-[#3a3a40] focus:border-[#d4b483]/60"
                    />
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={handleMessageKeyDown}
                      rows={5}
                      spellCheck={false}
                      placeholder="write your message..."
                      className="w-full resize-none border border-[#242428] bg-transparent px-3 py-2.5 text-[13px] text-[#e8e8ea] caret-[#ffddc0] outline-none transition-colors placeholder:text-[#3a3a40] focus:border-[#d4b483]/60"
                    />
                  )}
                </div>

                {/* Buttons + step counter */}
                <div className="mb-8 flex items-center gap-3">
                  {currentStep < 3 ? (
                    <button
                      onClick={advance}
                      className="border border-[#242428] px-4 py-2 text-[12px] text-[#a8a8ad] transition-colors hover:border-[#d4b483]/60 hover:text-[#e8e8ea]"
                    >
                      [ ↵ next ]
                    </button>
                  ) : (
                    <button
                      onClick={handleSend}
                      className="border border-[#d4b483]/50 px-4 py-2 text-[12px] text-[#d4b483] transition-colors hover:border-[#d4b483] hover:bg-[#d4b483]/10"
                    >
                      [ ↵ send ]
                    </button>
                  )}
                  <button
                    onClick={handleCancel}
                    className="border border-[#242428] px-4 py-2 text-[12px] text-[#7c7c85] transition-colors hover:border-[#4a4a52] hover:text-[#a8a8ad]"
                  >
                    [ esc cancel ]
                  </button>
                  <span className="ml-auto text-[11px] text-[#4a4a52]">
                    step {currentStep + 1} of {STEP_KEYS.length}
                  </span>
                </div>

                {/* Privacy note */}
                <div className="text-[11px] text-[#4a4a52]">
                  // privacy: goes straight to my inbox · no third-party form service · no tracking
                </div>
              </div>
            ) : (
              /* Submitted confirmation */
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="text-[11px] text-[#4a4a52] tracking-[0.12em]">
                  ## or, compose here
                </div>
                <div className="text-[12.5px] text-[#7c7c85]">
                  <span className="text-[#8fb88f]">✓</span> message sent
                </div>
                <div className="text-[13px] leading-[1.7] text-[#a8a8ad]">
                  Got it, <span className="text-[#e8e8ea]">{values.name}</span>. I&apos;ll
                  reply to <span className="text-[#d4b483]">{values.email}</span> within{" "}
                  {personal.responseTime}.
                </div>
                <button
                  onClick={handleCancel}
                  className="mt-4 border border-[#242428] px-4 py-2 text-[12px] text-[#7c7c85] transition-colors hover:border-[#4a4a52] hover:text-[#a8a8ad]"
                >
                  [ send another ]
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
