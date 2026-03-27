import { fetchGitHubActivity } from "@/lib/github-activity";
import { GitHubActivityStrip } from "@/components/GitHubActivityStrip";

export const revalidate = 21600; // 6 hours

export async function GitHubActivityStripServer() {
  const activity = await fetchGitHubActivity();
  return <GitHubActivityStrip activity={activity} />;
}
