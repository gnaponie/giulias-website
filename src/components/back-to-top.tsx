"use client";

export function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="hover:text-primary transition-colors font-mono text-sm"
    >
      ↑ Top
    </button>
  );
}
