## Context

Building a personal website from scratch for a principal software engineer. The site needs to feel professional yet approachable, with sections for bio, blog posts, talks, and projects. Content is empty initially but the structure must make it easy to add later.

## Goals / Non-Goals

**Goals:**
- Deliver a fast, responsive, SEO-friendly personal website
- Make content easy to update (markdown-based content management)
- Keep the stack modern, maintainable, and deployable with minimal ops
- Support future expansion (newsletter, contact form, etc.)

**Non-Goals:**
- User authentication or accounts
- Dynamic user-generated content or comments system (for now)
- E-commerce or payment features
- CMS admin panel (markdown files are the CMS)

## Decisions

### Frontend: Next.js (App Router) with React + TypeScript

Next.js provides server-side rendering for SEO, file-based routing, and image optimization out of the box. It's the current industry standard for React-based content sites and has excellent DX. Tailwind CSS for styling — fast, utility-first, and easy to customize.

Alternatives considered:
- **Vite + React SPA**: Simpler but worse SEO without SSR/SSG
- **Astro**: Excellent for content sites, but user has React experience and may want interactive components later

### Backend / Content: Markdown files + Next.js API routes

Content lives as markdown files in a `content/` directory. Next.js reads and renders them at build time or on-demand. No separate backend service needed for v1 — keeps deployment simple. If a Python backend becomes necessary later (for APIs, automation, etc.), it can be added as a separate service.

Alternatives considered:
- **Flask/FastAPI backend**: Overkill for a content site; adds deployment complexity
- **Headless CMS**: Adds cost and complexity; markdown files are sufficient for now

### Styling: Tailwind CSS + shadcn/ui

Tailwind gives us rapid, consistent styling. shadcn/ui provides accessible, copy-paste components that integrate cleanly. This combo is the current sweet spot for "professional but not boring."

### Deployment: Vercel (or similar)

Next.js deploys to Vercel with zero config. Alternatives like Netlify or Cloudflare Pages also work.

## Risks / Trade-offs

- [No separate backend] → Limits dynamic features later, but can add a Python API service when needed
- [Markdown-only content] → No visual editor, but keeps the stack simple and git-friendly
- [Vercel lock-in] → Next.js works anywhere, but Vercel has the best DX; can self-host with `next start` if needed
