import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { BlogPostView } from "@/components/blog/BlogPost";
import { blogPosts } from "@/lib/blog-posts";

const post = blogPosts.find((p) => p.slug === "conversational-ai-for-sales")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://petersouza.dev/blog/${post.slug}/`,
    siteName: "Peter Souza",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
    images: [
      {
        url: "https://petersouza.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peter Souza — SDET · QA Automation & AI-assisted Testing",
      },
    ],
  },
  alternates: { canonical: `https://petersouza.dev/blog/${post.slug}/` },
};

export default function Page() {
  return (
    <PageWrapper>
      <BlogPostView post={post} />
    </PageWrapper>
  );
}
