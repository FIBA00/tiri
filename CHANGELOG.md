# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

- / feat-forms

## [0.0.1] - 2026-07-20-21

### Added

- new frontend context for managing event and guests: // src/lib/wizard-context.tsx.
- new layout for events wrapped by wizard context.
- new props: WizardGuest,WizardEvent, FieldProps,
- new ui components for input forms at different stages.
- new CreateEventForm to handle the form creation of event cards.
- added model in the prisma schema related to guest and event.
- adding guest forms created
- new types created in the props.types.ts for centralized type mgmt.
- guests page added to manage the adding and removing of guests.
- added cards component to have card templates. (draft)
- added cards template
- added cards template view page
- added preview route page
- added routing push on the new events page , for demo purposes.
- added guest schema that uses zod to validate the guest data before sending it to the backend.

### Changed

- changed the import of wizard props to its own file for better type management.

### Deprecated

### Removed

- manual excel upload validation in the excel import button

### Fixed

- bug in the redirecting the events page introduced due to unused useEffect to control the side effect of using router .
- type bug in the wizard context resulting in guest list creation silent error.

### Security

- did pnpm typecheck throughout the project to ensure type safety and avoid runtime errors.

## [0.0.1] - 2026-07-20

- initial release

## [0.0.1] - 2026-07-21

### Added

- added new files for auth include:
  - src/lib/schemas/auth.schema.ts (new)
  - src/lib/auth-client.ts (new — the proxy)
  - src/components/forms/SignInForm.tsx (new)
  - src/components/forms/SignUpForm.tsx (new)
  - src/app/auth/sign-in/page.tsx (replace)
  - src/app/auth/sign-up/page.tsx (replace)
  - src/app/auth/page.tsx (replace)
- bug fixes related to package manager usage.
- added new dependencies.

### Changed

### Deprecated

### Removed

### Fixed

### Security

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

- /

## [0.0.2] - 2026-07-23

### Added

- dashboard page 
- event summary card in features
- preview page
- invite server action
- invite server action schema

### Changed

### Deprecated

### Removed

### Fixed
- typo in prisma naming from "inviations" to "invitations".
- fixed syntax issue in the preview page
### Security


- initial release

<!-- Links -->

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
<!-- [unreleased]: https://github.com/Author/tiri/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/Author/tiri/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Author/tiri/releases/tag/v0.0.1 -->
