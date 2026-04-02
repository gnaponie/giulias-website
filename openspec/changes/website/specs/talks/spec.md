## ADDED Requirements

### Requirement: Talks listing page
The system SHALL render a talks page at `/talks` that lists presentations and talks, showing title, event name, date, and an optional link to recording or slides.

#### Scenario: Talks listing displays talks
- **WHEN** a user visits `/talks`
- **THEN** the system SHALL show all talks sourced from `content/talks/` sorted by date, newest first

#### Scenario: Talks listing handles empty state
- **WHEN** no talks exist
- **THEN** the system SHALL display a message indicating no talks yet

### Requirement: Talk content sourced from markdown
Each talk SHALL be defined by a markdown file in `content/talks/` with frontmatter containing title, event, date, and optional links.

#### Scenario: Talk details render from markdown
- **WHEN** a user views the talks page
- **THEN** the system SHALL parse frontmatter and body from each talk's markdown file
