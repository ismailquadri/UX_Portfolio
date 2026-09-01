"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CaseStudyCategory } from "@/lib/case-studies";

const CATEGORIES: CaseStudyCategory[] = ["FinTech", "AI-native", "GovTech"];
const inputClass = "rounded border border-gray-300 px-2 py-1";

export default function NewCaseStudyForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CaseStudyCategory>("FinTech");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, category, summary }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "create_failed" }));
      setError(data.error ?? "create_failed");
      return;
    }

    router.push(`/admin/${slug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        Slug (lowercase, hyphens only)
        <input
          className={inputClass}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          pattern="[a-z0-9-]+"
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        Title
        <input
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        Category
        <select
          className={inputClass}
          value={category}
          onChange={(event) => setCategory(event.target.value as CaseStudyCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Summary
        <textarea
          className={inputClass}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          required
        />
      </label>
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
      >
        {isSubmitting ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
