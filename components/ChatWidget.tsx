"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  suggestions?: string[];
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  "What's your experience?",
  "Tell me about infithra",
  "Are you open to freelance work?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Message[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: "model",
          text: data.reply ?? data.error ?? "Something went wrong.",
          suggestions: data.suggestions,
        },
      ]);
    } catch {
      setMessages([...next, { role: "model", text: "Something went wrong reaching the server." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex h-[520px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-stroke bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stroke px-4 py-3">
              <div>
                <p className="text-sm text-text-primary">Ask Mustafa</p>
                <p className="text-xs text-muted">AI-answered, in his own words</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-bg hover:text-text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-2 pb-2">
                  <p className="mb-2 text-xs text-muted">Try asking:</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-stroke bg-bg px-3 py-2 text-left text-xs text-muted transition-colors hover:border-text-primary/30 hover:text-text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "ml-auto bg-text-primary text-bg"
                        : "bg-bg text-text-primary"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.role === "model" &&
                    i === messages.length - 1 &&
                    !loading &&
                    m.suggestions &&
                    m.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="rounded-full border border-stroke bg-bg px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-text-primary/30 hover:text-text-primary"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              {loading && (
                <div className="w-fit rounded-xl bg-bg px-3 py-2 text-sm text-muted">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-stroke p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about my work…"
                className="flex-1 rounded-full border border-stroke bg-bg px-4 py-2 text-sm text-text-primary outline-none placeholder:text-muted focus:border-text-primary/30"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-text-primary text-bg transition-opacity disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle chat"
        className="cosmic-btn group relative flex h-14 w-14 items-center justify-center rounded-full bg-text-primary text-bg shadow-lg transition-transform duration-300 hover:scale-105"
      >
        <span
          className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ inset: "-2px" }}
        />
        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-text-primary">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-bg">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-bg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
