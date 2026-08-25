import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import CaseStudyListClient from "@/components/CaseStudyListClient";
import { getAllCaseStudies } from "@/lib/case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Quadri Ismail",
  description:
    "Selected UX and product design case studies across FinTech, AI-native, and GovTech.",
};

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main
          id="list"
          className="flex w-full flex-1 flex-col gap-12 px-6 py-14 md:px-6 md:py-14"
        >
          <div className="flex items-end justify-between whitespace-nowrap px-6 text-ink">
            <h1 className="font-heading text-[32px] tracking-[-0.32px] md:text-[56px] md:tracking-[-0.56px]">
              Case Studies
            </h1>
            <span className="font-body text-[18px] font-medium tracking-[-0.18px]">
              [ WORK ]
            </span>
          </div>
          <div className="h-px w-full bg-border-subtle" />
          <CaseStudyListClient caseStudies={caseStudies} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
