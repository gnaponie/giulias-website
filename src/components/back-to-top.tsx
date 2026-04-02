"use client";

export function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="hover:text-foreground transition-colors"
    >
      Back to top &uarr;
    </button>
  );
}
