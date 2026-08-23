import { notFound } from "next/navigation";
import { isDevOnly } from "@/lib/admin-guard";
import NewCaseStudyForm from "@/components/admin/NewCaseStudyForm";

export default function NewCaseStudyPage() {
  if (!isDevOnly()) notFound();
  return (
    <main className="mx-auto max-w-xl p-6 font-sans text-sm">
      <h1 className="text-xl font-semibold">New Case Study</h1>
      <div className="mt-4">
        <NewCaseStudyForm />
      </div>
    </main>
  );
}
