"use client";

import type { CaseStudyMetric } from "@/lib/case-studies";

const inputClass = "rounded border border-gray-300 px-2 py-1";
const buttonClass = "rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";

export default function MetricsEditor({
  metrics,
  onChange,
}: {
  metrics: CaseStudyMetric[];
  onChange: (metrics: CaseStudyMetric[]) => void;
}) {
  function updateMetric(index: number, field: keyof CaseStudyMetric, value: string) {
    const next = metrics.map((metric, i) =>
      i === index ? { ...metric, [field]: value } : metric
    );
    onChange(next);
  }

  function addMetric() {
    onChange([...metrics, { value: "", label: "" }]);
  }

  function removeMetric(index: number) {
    onChange(metrics.filter((_, i) => i !== index));
  }

  function moveMetric(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= metrics.length) return;
    const next = [...metrics];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
      <h3 className="text-base font-semibold">Metrics</h3>
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            className={inputClass}
            placeholder="Value (e.g. 79%)"
            value={metric.value}
            onChange={(event) => updateMetric(index, "value", event.target.value)}
          />
          <input
            className={`${inputClass} flex-1`}
            placeholder="Label"
            value={metric.label}
            onChange={(event) => updateMetric(index, "label", event.target.value)}
          />
          <button
            type="button"
            className={buttonClass}
            onClick={() => moveMetric(index, -1)}
            disabled={index === 0}
          >
            ↑
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => moveMetric(index, 1)}
            disabled={index === metrics.length - 1}
          >
            ↓
          </button>
          <button type="button" className={buttonClass} onClick={() => removeMetric(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={addMetric}>
        + Add metric
      </button>
    </div>
  );
}
