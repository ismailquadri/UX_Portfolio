"use client";

import type { RawSolutionItem } from "@/lib/case-study-admin";
import ImageUploadField from "@/components/admin/ImageUploadField";

const inputClass = "rounded border border-gray-300 px-2 py-1";
const buttonClass = "rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";
const cardClass = "flex flex-col gap-2 rounded border border-gray-300 p-3";

export default function SolutionEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: RawSolutionItem[];
  onChange: (items: RawSolutionItem[]) => void;
}) {
  function updateItem(index: number, next: Partial<RawSolutionItem>) {
    const updated = items.map((item, i) => (i === index ? { ...item, ...next } : item));
    onChange(updated);
  }

  function addItem() {
    onChange([...items, { heading: "", images: [], body: "" }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addImage(index: number) {
    updateItem(index, { images: [...items[index].images, ""] });
  }

  function updateImage(itemIndex: number, imageIndex: number, path: string) {
    const nextImages = items[itemIndex].images.map((img, i) => (i === imageIndex ? path : img));
    updateItem(itemIndex, { images: nextImages });
  }

  function removeLastImage(itemIndex: number) {
    const nextImages = items[itemIndex].images.slice(0, -1);
    updateItem(itemIndex, { images: nextImages });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
      <h3 className="text-base font-semibold">Solution</h3>
      {items.map((item, index) => (
        <div key={index} className={cardClass}>
          <input
            className={inputClass}
            placeholder="Heading"
            value={item.heading}
            onChange={(event) => updateItem(index, { heading: event.target.value })}
          />
          {item.images.map((image, imageIndex) => (
            <ImageUploadField
              key={imageIndex}
              slug={slug}
              value={image}
              maxWidth={1200}
              label={`Image ${imageIndex + 1}`}
              onChange={(path) => updateImage(index, imageIndex, path)}
            />
          ))}
          <div className="flex gap-2">
            <button type="button" className={buttonClass} onClick={() => addImage(index)}>
              + Add image
            </button>
            {item.images.length > 0 && (
              <button
                type="button"
                className={buttonClass}
                onClick={() => removeLastImage(index)}
              >
                Remove last image
              </button>
            )}
          </div>
          <textarea
            className={inputClass}
            placeholder="Body text"
            value={item.body}
            onChange={(event) => updateItem(index, { body: event.target.value })}
            rows={4}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveItem(index, 1)}
              disabled={index === items.length - 1}
            >
              ↓
            </button>
            <button type="button" className={buttonClass} onClick={() => removeItem(index)}>
              Remove item
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={addItem}>
        + Add solution item
      </button>
    </div>
  );
}
