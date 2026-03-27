import { fetchGitHubActivity } from "@/lib/github-activity";
import { HomeClient } from "@/components/HomeClient";

export const revalidate = 21600; // 6 hours ISR

export default async function Home() {
  const githubActivity = await fetchGitHubActivity();

  return <HomeClient githubActivity={githubActivity} />;
}
