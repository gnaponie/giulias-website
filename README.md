# Giulia's Website

Personal website of Giulia Naponiello, Principal Software Engineer at Red Hat. Built with Next.js, Tailwind CSS, and markdown-based content management.

Live at **[giulianapo.vercel.app](https://giulianapo.vercel.app)**

This project is open source under the [GPL-3.0 license](LICENSE).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
content/          # Markdown content (bio, blog, videos, projects)
  bio.md          # Bio page content
  blog/           # Blog posts (one .md per post)
  videos/         # Videos — talks, podcasts, presentations (one .md per video)
  projects/       # Projects (one .md per project)
src/
  app/            # Next.js App Router pages
  components/     # Shared UI components (Navbar, Footer, ThemeToggle)
  lib/            # Utilities (content parser)
```

## Adding Content

### Blog Post
Create `content/blog/my-post.md`:
```markdown
---
title: "My Post Title"
date: "2026-04-02"
excerpt: "Short description of the post."
tags: ["ci/cd"]
---

Your markdown content here.
```

### Video
Create `content/videos/video-name.md`:
```markdown
---
title: "Video Title"
event: "Conference Name"
date: "2026-04-02"
tags: ["talk"]
language: "EN"
youtube: "https://www.youtube.com/watch?v=..."
---

Video description here.
```

### Project
Create `content/projects/project-name.md`:
```markdown
---
title: "Project Name"
date: "2026-04-02"
description: "Short description."
tech: ["TypeScript", "React"]
github: "https://github.com/..."
size: "large"
---
```

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Content:** Markdown with gray-matter + remark + rehype-highlight
- **Deployment:** Vercel

## Deployment

Deployed on Vercel via CLI:

```bash
npx vercel --prod
```

A Dockerfile is also available for containerized deployment:

```bash
podman build -t giulias-website -f Containerfile .
podman run -p 3001:3001 giulias-website
```

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```
