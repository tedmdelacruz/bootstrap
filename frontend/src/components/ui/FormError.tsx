import React from "react";

export function FormError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <p className="text-sm text-red-500 mt-1">{error}</p>
  );
} 