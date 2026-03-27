export interface GitHubCommit {
  repo: string;
  message: string;
  date: string;
  sha: string;
  url: string;
}

export interface GitHubActivity {
  commits: GitHubCommit[];
  streak: number;
  topLanguages: string[];
}

const GITHUB_USERNAME = "PeterTechDev";

function relativeDate(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export async function fetchGitHubActivity(): Promise<GitHubActivity> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Fetch public events
  const eventsRes = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
    { headers, next: { revalidate: 21600 } }
  );

  if (!eventsRes.ok) {
    return { commits: [], streak: 0, topLanguages: [] };
  }

  const events = await eventsRes.json();

  // Extract commits from PushEvents
  const commits: GitHubCommit[] = [];
  const commitDays = new Set<string>();

  for (const event of events) {
    if (event.type === "PushEvent" && event.payload?.commits) {
      const repoName = event.repo?.name?.split("/")[1] ?? event.repo?.name ?? "unknown";
      const eventDate = event.created_at as string;
      const dayKey = eventDate.slice(0, 10);
      commitDays.add(dayKey);

      for (const commit of event.payload.commits) {
        if (commits.length < 5) {
          commits.push({
            repo: repoName,
            message: commit.message?.split("\n")[0] ?? "commit",
            date: relativeDate(eventDate),
            sha: commit.sha?.slice(0, 7) ?? "",
            url: `https://github.com/${event.repo?.name}/commit/${commit.sha}`,
          });
        }
      }
    }
  }

  // Calculate streak
  const streak = calculateStreak(commitDays);

  // Top 3 languages this month from repos involved
  const reposInvolved = [
    ...new Set(
      events
        .filter((e: { type: string }) => e.type === "PushEvent")
        .map((e: { repo?: { name?: string } }) => e.repo?.name)
        .filter(Boolean)
        .slice(0, 10)
    ),
  ] as string[];

  const langCounts: Record<string, number> = {};

  await Promise.all(
    reposInvolved.slice(0, 5).map(async (repoFullName) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repoFullName}/languages`,
          { headers, next: { revalidate: 21600 } }
        );
        if (res.ok) {
          const langs = await res.json();
          for (const [lang, bytes] of Object.entries(langs)) {
            langCounts[lang] = (langCounts[lang] ?? 0) + (bytes as number);
          }
        }
      } catch {
        // ignore
      }
    })
  );

  const topLanguages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  return { commits: commits.slice(0, 5), streak, topLanguages };
}

function calculateStreak(commitDays: Set<string>): number {
  if (commitDays.size === 0) return 0;

  const today = new Date();
  let streak = 0;
  let current = new Date(today);

  // Check today first, if no commit today start from yesterday
  const todayKey = current.toISOString().slice(0, 10);
  if (!commitDays.has(todayKey)) {
    current.setDate(current.getDate() - 1);
  }

  while (true) {
    const key = current.toISOString().slice(0, 10);
    if (commitDays.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
