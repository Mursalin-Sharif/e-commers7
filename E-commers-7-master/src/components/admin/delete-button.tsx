"use client";

export function DeleteButton({ label = "Delete" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="text-xs text-red-500 hover:underline"
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this?")) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
