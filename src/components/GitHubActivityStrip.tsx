"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { GitHubActivity } from "@/lib/github-activity";
import { GitCommit, Flame, Code } from "lucide-react";

interface GitHubActivityStripProps {
  activity: GitHubActivity;
}

export function GitHubActivityStrip({ activity }: GitHubActivityStripProps) {
  const { theme } = useTheme();
  const { commits, streak, topLanguages } = activity;

  if (commits.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="px-6 md:px-12 lg:px-20 py-6"
    >
      <div
        className="rounded-2xl px-5 py-4 border flex flex-col gap-3"
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <GitCommit
              className="w-4 h-4 shrink-0"
              style={{ color: theme.colors.accent }}
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: theme.colors.textMuted }}
            >
              GitHub Activity
            </span>
          </div>

          {/* Streak + Languages */}
          <div className="flex items-center gap-4 flex-wrap">
            {streak > 0 && (
              <div className="flex items-center gap-1.5">
                <Flame
                  className="w-3.5 h-3.5"
                  style={{ color: theme.colors.accent }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: theme.colors.accent }}
                >
                  {streak}d streak
                </span>
              </div>
            )}

            {topLanguages.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Code
                  className="w-3.5 h-3.5"
                  style={{ color: theme.colors.textMuted }}
                />
                <div className="flex gap-1.5">
                  {topLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: theme.colors.cardBorder,
                        color: theme.colors.textMuted,
                        backgroundColor: theme.colors.bgSecondary,
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Commits ticker */}
        <div className="flex flex-col gap-1.5">
          {commits.map((commit, i) => (
            <motion.a
              key={commit.sha + i}
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-2 group min-w-0"
              style={{ color: theme.colors.textMuted }}
            >
              {/* Dot */}
              <span
                className="w-1 h-1 rounded-full shrink-0 opacity-60"
                style={{ backgroundColor: theme.colors.accent }}
              />

              {/* Repo */}
              <span
                className="text-xs font-mono shrink-0 hidden sm:inline"
                style={{ color: theme.colors.accent }}
              >
                {commit.repo}
              </span>

              {/* Separator */}
              <span className="text-xs opacity-30 shrink-0 hidden sm:inline">·</span>

              {/* Message */}
              <span className="text-xs truncate group-hover:underline min-w-0">
                {commit.message}
              </span>

              {/* Date */}
              <span className="text-xs opacity-50 shrink-0 ml-auto pl-2">
                {commit.date}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
