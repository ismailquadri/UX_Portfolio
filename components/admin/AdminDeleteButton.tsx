"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${slug}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/admin/case-studies/${slug}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      window.alert("Failed to delete case study.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
    >
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
