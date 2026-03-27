"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { blogPosts } from "@/lib/blog-posts";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";

export function BlogIndex() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      {/* Nav */}
      <nav className="px-5 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: theme.colors.textMuted }}
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-5 sm:px-6 pt-10 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
              style={{ color: theme.colors.accent }}
            >
              Writing
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-4"
              style={{ color: theme.colors.text }}
            >
              Blog
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              Engineering, product thinking, and the occasional career story. No
              fluff.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Post list */}
      <section className="px-5 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {[...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/blog/${post.slug}/`} className="block group">
                <div
                  className="rounded-2xl border p-6 sm:p-8 transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: theme.colors.accent + "20",
                        color: theme.colors.accent,
                      }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <Clock size={12} />
                      {post.readingTime}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h2
                    className="text-xl sm:text-2xl font-bold mb-3 group-hover:opacity-80 transition-opacity flex items-start gap-2"
                    style={{ color: theme.colors.text }}
                  >
                    {post.title}
                    <ArrowRight
                      size={18}
                      className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: theme.colors.accent }}
                    />
                  </h2>

                  <p
                    className="text-sm sm:text-base leading-relaxed mb-4"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                          background: theme.colors.bgSecondary,
                          color: theme.colors.textMuted,
                        }}
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-6 py-8 border-t" style={{ borderColor: theme.colors.cardBorder }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: theme.colors.accent }}
          >
            ← petersouza.dev
          </Link>
          <span className="text-xs" style={{ color: theme.colors.textMuted }}>
            © {new Date().getFullYear()} Peter Souza
          </span>
        </div>
      </footer>
    </div>
  );
}
