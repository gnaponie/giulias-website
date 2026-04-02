## 1. Project Setup

- [ ] 1.1 Initialize Next.js project with TypeScript and App Router
- [x] 1.2 Install and configure Tailwind CSS
- [ ] 1.3 Install and configure shadcn/ui
- [ ] 1.4 Set up content directory structure (`content/bio.md`, `content/blog/`, `content/talks/`, `content/projects/`)
- [ ] 1.5 Install markdown parsing library (gray-matter + remark/rehype)

## 2. Site Layout

- [ ] 2.1 Create root layout component with HTML structure and theme providers
- [ ] 2.2 Build responsive navigation bar with links to all sections
- [ ] 2.3 Implement mobile hamburger menu
- [ ] 2.4 Build footer component with social links
- [ ] 2.5 Define global theme tokens (typography, colors, spacing) in Tailwind config

## 3. Bio Page

- [ ] 3.1 Create content parser utility for markdown files with frontmatter
- [ ] 3.2 Build bio page component at `/` route
- [ ] 3.3 Add placeholder content to `content/bio.md`
- [ ] 3.4 Ensure responsive layout on all viewports

## 4. Blog

- [ ] 4.1 Create blog post parser utility (frontmatter + markdown body)
- [ ] 4.2 Build blog listing page at `/blog` with reverse chronological order
- [ ] 4.3 Build individual blog post page at `/blog/[slug]`
- [ ] 4.4 Add syntax highlighting for code blocks
- [ ] 4.5 Handle 404 for missing blog posts
- [ ] 4.6 Add empty state for when no posts exist
- [ ] 4.7 Add placeholder blog post in `content/blog/`

## 5. Talks

- [ ] 5.1 Create talk parser utility for frontmatter-based talk files
- [ ] 5.2 Build talks listing page at `/talks`
- [ ] 5.3 Handle empty state for no talks
- [ ] 5.4 Add placeholder talk in `content/talks/`

## 6. Projects

- [ ] 6.1 Create project parser utility for frontmatter-based project files
- [ ] 6.2 Build projects listing page at `/projects`
- [ ] 6.3 Handle empty state for no projects
- [ ] 6.4 Add placeholder project in `content/projects/`

## 7. Polish & Deployment

- [ ] 7.1 Add SEO metadata (OpenGraph tags, meta descriptions)
- [ ] 7.2 Generate sitemap
- [ ] 7.3 Add favicon and og:image
- [ ] 7.4 Configure deployment settings (vercel.json or similar)
- [ ] 7.5 Test responsive design across mobile, tablet, and desktop
