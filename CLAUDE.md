# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- No test framework is configured

## Architecture

Next.js 16 personal website (React 19, Tailwind CSS 4, TypeScript) with three content sections: blog, talks, and projects, plus a bio page.

### Content System

All content lives in `content/` as Markdown files with YAML frontmatter (parsed by `gray-matter`). The shared content engine in `src/lib/content.ts` provides:
- `getAllContent(directory)` — lists all items in a content subdirectory, sorted by date descending
- `getContentBySlug(directory, slug)` — fetches a single item by slug
- `getBioContent()` — reads `content/bio.md` specifically

Markdown is rendered to HTML via `remark` + `remark-html` with `rehype-highlight` for syntax highlighting. Content is injected with `dangerouslySetInnerHTML`.

Frontmatter fields vary by content type:
- **Blog**: `title`, `date`, `excerpt`, `tags`
- **Talks**: `title`, `date`, `event`
- **Projects**: `title`, `date` (plus any extras)

### Routing

App Router with these routes:
- `/` — bio/home page (`content/bio.md`)
- `/blog` — blog listing; `/blog/[slug]` — individual posts (uses `generateStaticParams`)
- `/talks` — talks listing
- `/projects` — projects listing

### Styling

Tailwind CSS 4 with `@tailwindcss/postcss`. UI primitives from shadcn (Base UI). Path alias `@/*` maps to `./src/*`.

### Deployment

`next.config.ts` uses `output: "standalone"`. A Dockerfile exists for containerized deployment.
