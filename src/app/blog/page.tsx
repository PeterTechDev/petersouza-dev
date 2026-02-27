import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import BlogIndex from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog — Peter Souza",
  description:
    "Engineering, product thinking, and career stories. AI development, multi-agent systems, and building SaaS products.",
  openGraph: {
    title: "Blog — Peter Souza",
    description: "Engineering, product thinking, and career stories.",
    url: "https://petersouza.dev/blog/",
  },
  alternates: { canonical: "https://petersouza.dev/blog/" },
};

export default function BlogPage() {
  return (
    <PageWrapper>
      <BlogIndex />
    </PageWrapper>
  );
}
