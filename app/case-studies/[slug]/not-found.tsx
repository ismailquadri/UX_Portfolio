import { Link } from "next-view-transitions";

export default function CaseStudyNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-[32px] text-ink">Case study not found</h1>
      <p className="font-body text-[16px] text-muted">
        That case study doesn&rsquo;t exist yet.
      </p>
      <Link href="/case-studies" className="font-body text-[14px] font-medium text-ink underline">
        Back to all case studies
      </Link>
    </div>
  );
}
