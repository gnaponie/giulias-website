## ADDED Requirements

### Requirement: Bio page displays personal information
The system SHALL render a dedicated bio page at `/` (homepage) that displays the engineer's name, title, photo, and a professional biography.

#### Scenario: Bio page renders with placeholder content
- **WHEN** a user visits the homepage
- **THEN** the system SHALL display a bio section with name, title, and biography text

#### Scenario: Bio page is responsive
- **WHEN** the page is viewed on mobile, tablet, or desktop
- **THEN** the layout SHALL adapt gracefully to the screen size

### Requirement: Bio content is sourced from markdown
The system SHALL read bio content from a `content/bio.md` file and render it on the page.

#### Scenario: Bio content loads from markdown
- **WHEN** the bio page is rendered
- **THEN** the system SHALL parse `content/bio.md` and display its contents
