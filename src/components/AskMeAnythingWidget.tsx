"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 10;
const STORAGE_KEY = "ps-chat-session";

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm an AI that knows all about Peter. Ask me anything — his projects, skills, availability, or how to reach him. 👋",
};

// Hardcoded dark theme — works outside ThemeProvider
const COLORS = {
  bg: "#111827",         // gray-900
  bgPanel: "#0f172a",    // slate-900
  card: "#1e293b",       // slate-800
  border: "#334155",     // slate-700
  text: "#f1f5f9",       // slate-100
  textMuted: "#94a3b8",  // slate-400
  accent: "#3b82f6",     // blue-500
  accentHover: "#2563eb",// blue-600
};

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

export function AskMeAnythingWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || limitReached) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const newCount = sessionCount + 1;
    setSessionCount(newCount);

    if (newCount >= MAX_MESSAGES) {
      setLimitReached(true);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          sessionCount: newCount,
          conversationId: getOrCreateSessionId(),
        }),
      });

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "You've reached the session limit. Refresh the page to start a new conversation!",
          },
        ]);
        return;
      }

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Sorry, something went wrong.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops, something went wrong. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, limitReached, messages, sessionCount]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "min(calc(100vw - 2rem), 24rem)",
              maxHeight: "min(520px, 75vh)",
              backgroundColor: COLORS.bgPanel,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b shrink-0"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: COLORS.accent }}
                />
                <span className="text-sm font-semibold" style={{ color: COLORS.text }}>
                  Ask Me Anything 💭
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: COLORS.textMuted }}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0"
              style={{ backgroundColor: COLORS.bgPanel }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            backgroundColor: COLORS.accent,
                            color: "#fff",
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            backgroundColor: COLORS.card,
                            border: `1px solid ${COLORS.border}`,
                            color: COLORS.text,
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: COLORS.card,
                      borderColor: COLORS.border,
                    }}
                  >
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          backgroundColor: COLORS.accent,
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rate limit notice */}
              {limitReached && (
                <p className="text-center text-xs mt-1" style={{ color: COLORS.textMuted }}>
                  Rate limit reached. Refresh to start a new conversation.
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Message counter */}
            <div
              className="px-4 py-1 flex justify-end shrink-0"
              style={{ backgroundColor: COLORS.card }}
            >
              <span className="text-xs opacity-50" style={{ color: COLORS.textMuted }}>
                {sessionCount}/{MAX_MESSAGES} messages
              </span>
            </div>

            {/* Input area */}
            <div
              className="px-3 py-3 border-t flex gap-2 items-center shrink-0"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || limitReached}
                placeholder={
                  limitReached ? "Session limit reached" : "Ask about Peter…"
                }
                className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40 disabled:opacity-40"
                style={{ color: COLORS.text }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || limitReached}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                style={{ backgroundColor: COLORS.accent }}
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: COLORS.accent }}
        aria-label={open ? "Close chat" : "Open Ask Me Anything chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
