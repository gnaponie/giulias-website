## ADDED Requirements

### Requirement: Blog listing page shows all posts
The system SHALL render a blog listing page at `/blog` that displays all published blog posts in reverse chronological order, showing title, date, and a short excerpt for each.

#### Scenario: Blog listing displays posts
- **WHEN** a user visits `/blog`
- **THEN** the system SHALL show all posts sorted by date, newest first

#### Scenario: Blog listing handles empty state
- **WHEN** no blog posts exist
- **THEN** the system SHALL display a friendly message indicating no posts yet

### Requirement: Individual blog post pages
The system SHALL render individual blog post pages at `/blog/<slug>` sourced from markdown files in `content/blog/`.

#### Scenario: Blog post renders from markdown
- **WHEN** a user visits `/blog/my-post`
- **THEN** the system SHALL render the content of `content/blog/my-post.md` with proper formatting

#### Scenario: Blog post not found
- **WHEN** a user requests a slug that has no corresponding markdown file
- **THEN** the system SHALL return a 404 page

### Requirement: Blog content supports rich formatting
The system SHALL support markdown formatting including headings, code blocks with syntax highlighting, images, links, and lists in blog posts.

#### Scenario: Code blocks render with syntax highlighting
- **WHEN** a blog post contains a fenced code block with a language tag
- **THEN** the system SHALL render the code with syntax highlighting
