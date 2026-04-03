"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "it";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "it") setLangState("it");
    setReady(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const t = {
  en: {
    blog: "Blog",
    videos: "Videos",
    projects: "Projects",
    tags: "Tags",
    language: "Language",
    back: "← Back",
    noPosts: "No posts yet.",
    noVideos: "No videos yet.",
    noProjects: "No projects yet.",
    latestCommits: "latest commits:",
    madeWith: "made with coffee & curiosity",
    projectsIntro: "Turns out, even in open source, not everything is... open. Here\u2019s what made the cut.",
    allPosts: "← All posts",
    allVideos: "← All videos",
  },
  it: {
    blog: "Blog",
    videos: "Video",
    projects: "Progetti",
    tags: "Tag",
    language: "Lingua",
    back: "← Indietro",
    noPosts: "Nessun articolo.",
    noVideos: "Nessun video.",
    noProjects: "Nessun progetto.",
    latestCommits: "ultimi commit:",
    madeWith: "fatto con caffè e curiosità",
    projectsIntro: "Anche nell\u2019open source, non tutto è... open. Ecco quello che è sopravvissuto.",
    allPosts: "← Tutti gli articoli",
    allVideos: "← Tutti i video",
  },
} as const;
