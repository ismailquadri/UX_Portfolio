import Link from "next/link";
import { notFound } from "next/navigation";
import { isDevOnly } from "@/lib/admin-guard";
import { getAllRawCaseStudies } from "@/lib/case-study-admin";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export default function AdminPage() {
  if (!isDevOnly()) notFound();

  const caseStudies = getAllRawCaseStudies();

  return (
    <main className="mx-auto max-w-3xl p-6 font-sans text-sm">
      <h1 className="text-xl font-semibold">Case Studies</h1>
      <p className="mt-2">
        <Link href="/admin/new" className="underline">
          + Add new case study
        </Link>
      </p>
      <ul className="mt-4 list-none p-0">
        {caseStudies.map((cs) => (
          <li
            key={cs.slug}
            className="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <div>
              <strong>{cs.title}</strong>
              <div className="text-xs text-gray-500">{cs.slug}</div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/${cs.slug}`}
                className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
              >
                Edit
              </Link>
              <AdminDeleteButton slug={cs.slug} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
