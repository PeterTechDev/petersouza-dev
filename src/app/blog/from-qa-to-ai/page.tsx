import type { Metadata } from "next";
import { PageWrapper } from "@/components/PageWrapper";
import { BlogPostView } from "@/components/blog/BlogPost";
import { blogPosts } from "@/lib/blog-posts";

const post = blogPosts.find((p) => p.slug === "from-qa-to-ai")!;

export const metadata: Metadata = {
  title: `${post.title} — Peter Souza`,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://petersouza.dev/blog/${post.slug}/`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
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
