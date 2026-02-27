import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import AutoVendasCaseStudy from "@/components/case-studies/AutoVendasCaseStudy";

export const metadata: Metadata = {
  title: "AutoVendas Case Study — Peter Souza",
  description:
    "How I built an AI-powered WhatsApp CRM for Brazilian car dealerships using multi-agent orchestration, Twilio, and Supabase.",
  openGraph: {
    title: "AutoVendas Case Study — Peter Souza",
    description:
      "Multi-agent AI CRM for car dealerships. < 5s response time, 24/7 coverage, 3 dealerships in production.",
    url: "https://petersouza.dev/case-study/autovendas/",
    type: "website",
  },
  alternates: { canonical: "https://petersouza.dev/case-study/autovendas/" },
};

export default function Page() {
  return (
    <PageWrapper>
      <AutoVendasCaseStudy />
    </PageWrapper>
  );
}
