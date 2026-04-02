## ADDED Requirements

### Requirement: Consistent navigation across pages
The system SHALL provide a persistent navigation bar on all pages with links to Bio (home), Blog, Talks, and Projects sections.

#### Scenario: Navigation renders on every page
- **WHEN** any page is loaded
- **THEN** the navigation bar SHALL be visible with links to all sections

#### Scenario: Active page is highlighted in navigation
- **WHEN** a user is on a specific section page
- **THEN** the corresponding nav link SHALL be visually highlighted

### Requirement: Responsive layout system
The system SHALL provide a responsive layout that works on mobile (320px+), tablet (768px+), and desktop (1024px+) viewports.

#### Scenario: Layout adap on mobile
- **WHEN** the viewport width is below 768px
- **THEN** the navigation SHALL collapse into a hamburger menu

### Requirement: Consistent visual theme
The system SHALL implement a cohesive visual theme (typography, colors, spacing) that feels professional but approachable.

#### Scenario: Theme applies consistently
- **WHEN** any page is rendered
- **THEN** all elements SHALL use the shared theme tokens

### Requirement: Footer with links
The system SHALL render a footer on all pages with copyright, social links, and a link back to the top.

#### Scenario: Footer renders on every page
- **WHEN** any page is loaded
- **THEN** the footer SHALL be visible at the bottom
