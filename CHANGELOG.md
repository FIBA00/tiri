# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

- / feat-forms

## [0.0.2] - 2026-07-20

### Added

- new frontend context for managing event and guests: // src/lib/wizard-context.tsx.
- new layout for events wrapped by wizard context.
- new props: WizardGuest,WizardEvent, FieldProps,
- new ui components for input forms at different stages.
- new CreateEventForm to handle the form creation of event cards.
- added model in the prisma schema related to guest and event.
- adding guest forms created
- new types creaetd in the props.types.ts for centralized type mgmt.
- geusts page added to manage the adding and removing of guests.
- added cards component to have card templates. (draft)
- added cards template
- added cards template view page
- added preview route page

### Changed

### Deprecated

### Removed

### Fixed
- bug in the redirecting the events page introduced due to unused useEffect to control the side effect of using router .

### Security

## [0.0.1] - 2026-07-20

- initial release

<!-- Links -->

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
<!-- [unreleased]: https://github.com/Author/tiri/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/Author/tiri/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Author/tiri/releases/tag/v0.0.1 -->
