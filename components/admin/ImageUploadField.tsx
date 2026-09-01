"use client";

import { useState, type ChangeEvent } from "react";

export default function ImageUploadField({
  slug,
  value,
  maxWidth,
  onChange,
  label,
}: {
  slug: string;
  value?: string;
  maxWidth: number;
  onChange: (path: string) => void;
  label: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("maxWidth", String(maxWidth));

    const response = await fetch(`/api/admin/case-studies/${slug}/images`, {
      method: "POST",
      body: formData,
    });
    setIsUploading(false);

    if (!response.ok) {
      window.alert("Image upload failed.");
      event.target.value = "";
      return;
    }

    const data = await response.json();
    onChange(data.path);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="max-h-40 max-w-60 rounded border border-gray-300 object-cover"
        />
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <span className="text-xs text-gray-500">Uploading…</span>}
      {value && <span className="text-xs text-gray-500">{value}</span>}
    </div>
  );
}
