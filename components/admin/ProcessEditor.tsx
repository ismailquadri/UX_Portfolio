"use client";

import type { CaseStudyProcessInsight } from "@/lib/case-studies";
import ImageUploadField from "@/components/admin/ImageUploadField";

const inputClass = "rounded border border-gray-300 px-2 py-1";
const buttonClass = "rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";
const cardClass = "flex flex-col gap-2 rounded border border-gray-300 p-3";

export default function ProcessEditor({
  slug,
  insights,
  onChange,
}: {
  slug: string;
  insights: CaseStudyProcessInsight[];
  onChange: (insights: CaseStudyProcessInsight[]) => void;
}) {
  function updateInsight(index: number, next: Partial<CaseStudyProcessInsight>) {
    const updated = insights.map((insight, i) =>
      i === index ? { ...insight, ...next } : insight
    );
    onChange(updated);
  }

  function addInsight() {
    onChange([...insights, { text: "" }]);
  }

  function removeInsight(index: number) {
    onChange(insights.filter((_, i) => i !== index));
  }

  function moveInsight(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= insights.length) return;
    const next = [...insights];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
      <h3 className="text-base font-semibold">Process</h3>
      {insights.map((insight, index) => (
        <div key={index} className={cardClass}>
          <input
            className={inputClass}
            placeholder="Insight text"
            value={insight.text}
            onChange={(event) => updateInsight(index, { text: event.target.value })}
          />
          <ImageUploadField
            slug={slug}
            value={insight.image}
            maxWidth={1200}
            label="Optional image"
            onChange={(path) => updateInsight(index, { image: path })}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveInsight(index, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveInsight(index, 1)}
              disabled={index === insights.length - 1}
            >
              ↓
            </button>
            <button type="button" className={buttonClass} onClick={() => removeInsight(index)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={addInsight}>
        + Add insight
      </button>
    </div>
  );
}
