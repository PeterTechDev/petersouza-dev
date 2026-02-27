"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { type BlogPost } from "@/lib/blog-posts";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export default function BlogPostView({ post }: { post: BlogPost }) {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      {/* Nav */}
      <nav className="px-5 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: theme.colors.textMuted }}
          >
            <ArrowLeft size={16} />
            Blog
          </Link>
          <span style={{ color: theme.colors.cardBorder }}>/</span>
          <span
            className="text-sm truncate"
            style={{ color: theme.colors.textMuted }}
          >
            {post.title}
          </span>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-5 sm:px-6 pt-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
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
              <time
                className="text-xs"
                style={{ color: theme.colors.textMuted }}
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-6"
              style={{ color: theme.colors.text }}
            >
              {post.title}
            </h1>

            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: theme.colors.textMuted }}
            >
              {post.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pb-8 border-b" style={{ borderColor: theme.colors.cardBorder }}>
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
          </motion.div>
        </div>
      </header>

      {/* Article content */}
      <motion.article
        className="px-5 sm:px-6 pb-24"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div
          className="max-w-2xl mx-auto prose-like"
          style={{
            color: theme.colors.textMuted,
            "--accent": theme.colors.accent,
            "--text": theme.colors.text,
            "--card": theme.colors.card,
            "--card-border": theme.colors.cardBorder,
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>

      {/* Footer */}
      <footer
        className="px-5 sm:px-6 py-8 border-t"
        style={{ borderColor: theme.colors.cardBorder }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: theme.colors.accent }}
          >
            <ArrowLeft size={16} />
            All posts
          </Link>
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: theme.colors.textMuted }}
          >
            petersouza.dev
          </Link>
        </div>
      </footer>
    </div>
  );
}
