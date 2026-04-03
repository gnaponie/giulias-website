# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- No test framework is configured

## Architecture

Next.js 16 personal website (React 19, Tailwind CSS 4, TypeScript) with content sections: blog, videos, and projects, plus a bio page.

### Content System

All content lives in `content/` as Markdown files with YAML frontmatter (parsed by `gray-matter`). The shared content engine in `src/lib/content.ts` provides:
- `getAllContent(directory)` — lists all items in a content subdirectory, sorted by date descending
- `getContentBySlug(directory, slug)` — fetches a single item by slug
- `getBioContent()` — reads `content/bio.md` specifically

Markdown is rendered to HTML via `remark` + `remark-html` with `rehype-highlight` for syntax highlighting. Content is injected with `dangerouslySetInnerHTML`.

Frontmatter fields vary by content type:
- **Blog**: `title`, `date`, `excerpt`, `tags`
- **Videos**: `title`, `date`, `event`, `tags`, `language`, `youtube`
- **Projects**: `title`, `date`, `description`, `tech`, `github`, `size`

### Routing

App Router with these routes:
- `/` — bio/home page (`content/bio.md`)
- `/blog` — blog listing; `/blog/[slug]` — individual posts (uses `generateStaticParams`)
- `/videos` — videos listing; `/videos/tag/[tag]` — filtered by tag
- `/projects` — projects listing (fetches latest commits from GitHub API, cached 24h)

### Styling

Tailwind CSS 4 with `@tailwindcss/postcss`. UI primitives from shadcn (Base UI). Path alias `@/*` maps to `./src/*`.

### Deployment

`next.config.ts` uses `output: "standalone"`. Deployed on Vercel via CLI (`npx vercel --prod`). A Dockerfile is also available for containerized deployment.
