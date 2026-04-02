# Giulia's Website

Personal website for a principal software engineer. Built with Next.js, Tailwind CSS, and markdown-based content management.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
content/          # Markdown content (bio, blog, talks, projects)
  bio.md          # Bio page content
  blog/           # Blog posts (one .md per post)
  talks/          # Talks (one .md per talk)
  projects/       # Projects (one .md per project)
src/
  app/            # Next.js App Router pages
  components/     # Shared UI components (Navbar, Footer, etc.)
  lib/            # Utilities (content parser, etc.)
```

## Adding Content

### Blog Post
Create `content/blog/my-post.md`:
```markdown
---
title: "My Post Title"
date: "2026-04-02"
excerpt: "Short description of the post."
---

Your markdown content here.
```

### Talk
Create `content/talks/talk-name.md`:
```markdown
---
title: "Talk Title"
event: "Conference Name"
date: "2026-04-02"
---

Talk description here.
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
demo: "https://..."
---

Project details here.
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Content:** Markdown files parsed with gray-matter + remark
- **Syntax highlighting:** rehype-highlight
- **Deployment:** Vercel

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```
