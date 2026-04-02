## 1. Project Setup

- [x] 1.1 Initialize Next.js project with TypeScript and App Router
- [x] 1.2 Install and configure Tailwind CSS
- [x] 1.3 Install and configure shadcn/ui
- [x] 1.4 Set up content directory structure (`content/bio.md`, `content/blog/`, `content/talks/`, `content/projects/`)
- [x] 1.5 Install markdown parsing library (gray-matter + remark/rehype)

## 2. Site Layout

- [x] 2.1 Create root layout component with HTML structure and theme providers
- [x] 2.2 Build responsive navigation bar with links to all sections
- [x] 2.3 Implement mobile hamburger menu
- [x] 2.4 Build footer component with social links
- [x] 2.5 Define global theme tokens (typography, colors, spacing) in Tailwind config

## 3. Bio Page

- [x] 3.1 Create content parser utility for markdown files with frontmatter
- [x] 3.2 Build bio page component at `/` route
- [x] 3.3 Add placeholder content to `content/bio.md`
- [x] 3.4 Ensure responsive layout on all viewports

## 4. Blog

- [x] 4.1 Create blog post parser utility (frontmatter + markdown body)
- [x] 4.2 Build blog listing page at `/blog` with reverse chronological order
- [x] 4.3 Build individual blog post page at `/blog/[slug]`
- [x] 4.4 Add syntax highlighting for code blocks
- [x] 4.5 Handle 404 for missing blog posts
- [x] 4.6 Add empty state for when no posts exist
- [x] 4.7 Add placeholder blog post in `content/blog/`

## 5. Talks

- [x] 5.1 Create talk parser utility for frontmatter-based talk files
- [x] 5.2 Build talks listing page at `/talks`
- [x] 5.3 Handle empty state for no talks
- [x] 5.4 Add placeholder talk in `content/talks/`

## 6. Projects

- [x] 6.1 Create project parser utility for frontmatter-based project files
- [x] 6.2 Build projects listing page at `/projects`
- [x] 6.3 Handle empty state for no projects
- [x] 6.4 Add placeholder project in `content/projects/`

## 7. Polish & Deployment

- [x] 7.1 Add SEO metadata (OpenGraph tags, meta descriptions)
- [x] 7.2 Generate sitemap
- [x] 7.3 Add favicon and og:image
- [x] 7.4 Configure deployment settings (vercel.json or similar)
- [x] 7.5 Test responsive design across mobile, tablet, and desktop
