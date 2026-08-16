export type CaseStudy = {
  slug: string;
  title: string;
  category: "FinTech" | "AI-native" | "GovTech";
  summary: string;
  readLink: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ryno-finance",
    title: "Ryno Finance - Compliance State Machine",
    category: "FinTech",
    summary: "Designing the queue where one click blocks or clears real money",
    readLink: "Read case study",
  },
  {
    slug: "linqart",
    title: "Linqart - AI Dependency Graph",
    category: "AI-native",
    summary: "Mapping a multi-merchant matching system nobody had visualized before",
    readLink: "Read case study",
  },
  {
    slug: "federal-pms",
    title: "Federal PMS - Org-Scale Role System",
    category: "GovTech",
    summary: "A national civil-service platform managing 800+ federal agencies",
    readLink: "Read case study",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
