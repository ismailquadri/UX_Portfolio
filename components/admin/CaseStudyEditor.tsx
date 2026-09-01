"use client";

import Link from "next/link";
import { useState } from "react";
import type { RawCaseStudyContent } from "@/lib/case-study-admin";
import type { CaseStudyCategory } from "@/lib/case-studies";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MetricsEditor from "@/components/admin/MetricsEditor";
import ProcessEditor from "@/components/admin/ProcessEditor";
import SolutionEditor from "@/components/admin/SolutionEditor";

const CATEGORIES: CaseStudyCategory[] = ["FinTech", "AI-native", "GovTech"];
const inputClass = "rounded border border-gray-300 px-2 py-1";
const labelClass = "flex flex-col gap-1";

export default function CaseStudyEditor({ initial }: { initial: RawCaseStudyContent }) {
  const [data, setData] = useState<RawCaseStudyContent>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update<K extends keyof RawCaseStudyContent>(key: K, value: RawCaseStudyContent[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setStatus("saving");
    const response = await fetch(`/api/admin/case-studies/${data.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(response.ok ? "saved" : "error");
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="flex justify-between">
        <Link href="/admin" className="underline">
          &larr; Back to list
        </Link>
        <Link href={`/case-studies/${data.slug}`} target="_blank" className="underline">
          View live &rarr;
        </Link>
      </div>

      <h1 className="text-xl font-semibold">Edit: {data.title || data.slug}</h1>

      <label className={labelClass}>
        Title
        <input
          className={inputClass}
          value={data.title}
          onChange={(event) => update("title", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Summary
        <textarea
          className={inputClass}
          value={data.summary}
          onChange={(event) => update("summary", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Category
        <select
          className={inputClass}
          value={data.category}
          onChange={(event) => update("category", event.target.value as CaseStudyCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Role
        <input
          className={inputClass}
          value={data.role ?? ""}
          onChange={(event) => update("role", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Team
        <input
          className={inputClass}
          value={data.team ?? ""}
          onChange={(event) => update("team", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Client
        <input
          className={inputClass}
          value={data.client ?? ""}
          onChange={(event) => update("client", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Duration
        <input
          className={inputClass}
          value={data.duration ?? ""}
          onChange={(event) => update("duration", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Location
        <input
          className={inputClass}
          value={data.location ?? ""}
          onChange={(event) => update("location", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Live URL
        <input
          className={inputClass}
          value={data.liveUrl ?? ""}
          onChange={(event) => update("liveUrl", event.target.value)}
        />
      </label>

      <ImageUploadField
        slug={data.slug}
        value={data.heroImage}
        maxWidth={1600}
        label="Hero image"
        onChange={(path) => update("heroImage", path)}
      />

      <MetricsEditor
        metrics={data.metrics ?? []}
        onChange={(metrics) => update("metrics", metrics)}
      />

      <label className={`${labelClass} border-t border-gray-200 pt-4`}>
        <span className="text-base font-semibold">Problem</span>
        <textarea
          className={inputClass}
          value={data.problem ?? ""}
          onChange={(event) => update("problem", event.target.value)}
          rows={6}
        />
      </label>

      <ProcessEditor
        slug={data.slug}
        insights={data.process ?? []}
        onChange={(process) => update("process", process)}
      />

      <label className={`${labelClass} border-t border-gray-200 pt-4`}>
        <span className="text-base font-semibold">Obstacles</span>
        <textarea
          className={inputClass}
          value={data.obstacles ?? ""}
          onChange={(event) => update("obstacles", event.target.value)}
          rows={6}
        />
      </label>

      <SolutionEditor
        slug={data.slug}
        items={data.solution ?? []}
        onChange={(solution) => update("solution", solution)}
      />

      <label className={`${labelClass} border-t border-gray-200 pt-4`}>
        <span className="text-base font-semibold">Outcome</span>
        <textarea
          className={inputClass}
          value={data.outcome ?? ""}
          onChange={(event) => update("outcome", event.target.value)}
          rows={6}
        />
      </label>

      <label className={labelClass}>
        <span className="text-base font-semibold">Close</span>
        <textarea
          className={inputClass}
          value={data.close ?? ""}
          onChange={(event) => update("close", event.target.value)}
          rows={6}
        />
      </label>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-green-600">Saved.</span>}
        {status === "error" && <span className="text-red-600">Failed to save.</span>}
      </div>
    </div>
  );
}
