export interface QualityRun {
  id: number;
  status: string;
  conclusion: string | null;
  startedAt: string | null;
  sha: string | null;
  durationMs: number | null;
  url: string | null;
}

export type QualityReport =
  | { state: "empty"; runs: [] }
  | { state: "error"; runs: [] }
  | { state: "ready"; runs: QualityRun[] };

const GITHUB_OWNER = "PeterTechDev";
const GITHUB_REPO = "petersouza-dev";
const QUALITY_WORKFLOW = "quality.yml";
const RUN_LIMIT = 8;
const REVALIDATE_SECONDS = 21600;

function emptyReport(): QualityReport {
  return { state: "empty", runs: [] };
}

function errorReport(): QualityReport {
  return { state: "error", runs: [] };
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function isoOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed).toISOString();
}

function shortSha(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^[0-9a-f]{7,40}$/i.test(trimmed)) return null;
  return trimmed.slice(0, 7);
}

function runUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("https://github.com/")) return null;
  return value;
}

function reportedDurationMs(body: unknown): number | null {
  if (!body || typeof body !== "object") return null;
  const ms = (body as { run_duration_ms?: unknown }).run_duration_ms;
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) return null;
  return ms;
}

async function fetchReportedDuration(id: number, headers: HeadersInit): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs/${id}/timing`,
      { headers, next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!response.ok) return null;
    return reportedDurationMs(await response.json());
  } catch {
    return null;
  }
}

function asRun(value: unknown): QualityRun | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== "number" || !Number.isFinite(raw.id)) return null;
  if (typeof raw.status !== "string" || raw.status.length === 0) return null;

  const conclusion =
    typeof raw.conclusion === "string" && raw.conclusion.length > 0 ? raw.conclusion : null;

  return {
    id: raw.id,
    status: raw.status,
    conclusion,
    startedAt: isoOrNull(raw.run_started_at) ?? isoOrNull(raw.created_at),
    sha: shortSha(raw.head_sha),
    durationMs: null,
    url: runUrl(raw.html_url),
  };
}

export async function fetchQualityRuns(): Promise<QualityReport> {
  const headers = githubHeaders();
  let response: Response;
  try {
    response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${QUALITY_WORKFLOW}/runs?per_page=${RUN_LIMIT}`,
      { headers, next: { revalidate: REVALIDATE_SECONDS } },
    );
  } catch {
    return errorReport();
  }

  // A missing workflow file is 404. That is "not yet run", not an API failure.
  if (response.status === 404) return emptyReport();
  if (!response.ok) return errorReport();

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return errorReport();
  }

  if (!body || typeof body !== "object") return errorReport();
  const workflowRuns = (body as { workflow_runs?: unknown }).workflow_runs;
  if (!Array.isArray(workflowRuns)) return errorReport();
  if (workflowRuns.length === 0) return emptyReport();

  const runs = workflowRuns
    .slice(0, RUN_LIMIT)
    .map(asRun)
    .filter((run): run is QualityRun => run !== null);

  if (runs.length === 0) return errorReport();

  const withDuration = await Promise.all(
    runs.map(async (run) => {
      if (run.status !== "completed") return run;
      return { ...run, durationMs: await fetchReportedDuration(run.id, headers) };
    }),
  );

  return { state: "ready", runs: withDuration };
}
