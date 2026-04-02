## ADDED Requirements

### Requirement: Projects listing page
The system SHALL render a projects page at `/projects` that showcases selected projects with title, description, tech stack, and links (GitHub, demo, etc.).

#### Scenario: Projects listing displays projects
- **WHEN** a user visits `/projects`
- **THEN** the system SHALL show all projects sourced from `content/projects/` sorted by date, newest first

#### Scenario: Projects listing handles empty state
- **WHEN** no projects exist
- **THEN** the system SHALL display a message indicating no projects yet

### Requirement: Project content sourced from markdown
Each project SHALL be defined by a markdown file in `content/projects/` with frontmatter containing title, description, tech stack, and optional links.

#### Scenario: Project details render from markdown
- **WHEN** a user views the projects page
- **THEN** the system SHALL parse frontmatter and body from each project's markdown file
