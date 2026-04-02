"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (dark === null) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  if (dark === null) return null;

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors bg-muted border border-border"
      aria-label="Toggle theme"
      role="switch"
      aria-checked={dark}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-xs transition-transform ${
          dark ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {dark ? "☽" : "☀"}
      </span>
    </button>
  );
}
