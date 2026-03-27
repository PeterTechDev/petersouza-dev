"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 10;

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm an AI that knows all about Peter. Ask me anything — his projects, skills, availability, or how to reach him. 👋",
};

export function ChatWidget() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  async function sendMessage() {
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

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong." },
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
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const accentStyle = { backgroundColor: theme.colors.accent };
  const accentText = { color: theme.colors.accent };

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
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 flex flex-col rounded-2xl border overflow-hidden shadow-2xl"
            style={{
              backgroundColor: theme.colors.bgSecondary,
              borderColor: theme.colors.cardBorder,
              maxHeight: "min(520px, 75vh)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: theme.colors.cardBorder,
                backgroundColor: theme.colors.card,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={accentStyle}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.text }}
                >
                  Ask me anything
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: theme.colors.textMuted }}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
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
                            ...accentStyle,
                            color: "#fff",
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            backgroundColor: theme.colors.card,
                            border: `1px solid ${theme.colors.cardBorder}`,
                            color: theme.colors.text,
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
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.cardBorder,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ ...accentStyle, animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ ...accentStyle, animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ ...accentStyle, animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Session counter */}
            <div
              className="px-4 py-1 flex justify-end"
              style={{ backgroundColor: theme.colors.card }}
            >
              <span
                className="text-xs opacity-50"
                style={{ color: theme.colors.textMuted }}
              >
                {sessionCount}/{MAX_MESSAGES} messages
              </span>
            </div>

            {/* Input area */}
            <div
              className="px-3 py-3 border-t flex gap-2 items-center"
              style={{
                borderColor: theme.colors.cardBorder,
                backgroundColor: theme.colors.card,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || limitReached}
                placeholder={limitReached ? "Session limit reached" : "Ask about Peter…"}
                className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40 disabled:opacity-40"
                style={{ color: theme.colors.text }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || limitReached}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                style={accentStyle}
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

      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={accentStyle}
        aria-label="Open chat"
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
