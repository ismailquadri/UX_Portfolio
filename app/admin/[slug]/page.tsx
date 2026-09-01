import { notFound } from "next/navigation";
import { isDevOnly } from "@/lib/admin-guard";
import { getRawCaseStudyContent } from "@/lib/case-study-admin";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isDevOnly()) notFound();
  const { slug } = await params;
  const caseStudy = getRawCaseStudyContent(slug);
  if (!caseStudy) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6 font-sans">
      <CaseStudyEditor initial={caseStudy} />
    </main>
  );
}
