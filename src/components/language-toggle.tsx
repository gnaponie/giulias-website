"use client";

import { useLanguage } from "@/lib/language";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "it" : "en")}
      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors bg-muted border border-border"
      aria-label="Toggle language"
      role="switch"
      aria-checked={lang === "it"}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-mono font-bold transition-transform ${
          lang === "it" ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {lang === "it" ? "IT" : "EN"}
      </span>
    </button>
  );
}
