# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

- /

## [0.0.3] - 2025-11-12

### Added

- Playwright Clerk test configuration and global setup
- NAV_SIGN and NAV_USER menu configurations in `src/consts.ts`
- VS Code settings for terminal command auto-approval
- RBAC permissions tests

### Changed

- Moved `tests/global.setup.ts` to `tests/e2e/global.setup.ts`
- Updated `playwright.config.ts` with Clerk-specific test project
- Re-enabled route protection middleware for unauthenticated users
- Cleared Clerk user.json test data
- Moved `tests/global.setup.ts` to `tests/e2e` where it belongs

## [0.0.2] - 2025-11-11

### Added

- Role-Based Access Control (RBAC) system with admin, editor, and viewer roles
- Authentication system integration with Clerk
- User permission management with configurable permissions via environment variables
- Sign-in and sign-up pages with Clerk components
- RBAC helper functions for permission checking (`userCanContentDelete`, `userCanContentRead`, `userCanContentWrite`, `userCanUsersManage`)
- Role checking functions (`isAdmin`, `isEditor`, `isViewer`, `isAuthenticated`)
- User context type definitions for authentication state
- Test pages for demonstrating RBAC functionality (`/test/admin`, `/test/editor`, `/test/viewer`, `/test/components`)
- Protected route system with role-based menu rendering
- RBAC component for conditional content rendering
- Environment variable support for role and permission configuration
- Clerk authentication middleware integration
- User role and permission assignment from Clerk metadata

### Changed

- Updated type definitions to separate auth and site-specific types
- Enhanced site constants with RBAC menu configurations
- Improved header component with authentication state handling
- Updated Astro configuration for Clerk integration
- Modified global styles to include Clerk-specific styling

### Security

- Implemented role-based access control to restrict access to sensitive pages and functionality
- Added permission-based content rendering to prevent unauthorized access to UI elements


## [0.0.1] - 2025-11-02

- initial release

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
[unreleased]: https://github.com/jphat/clerk/compare/v0.0.3...HEAD
[0.0.3]: https://github.com/jphat/clerk/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/jphat/clerk/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/jphat/clerk/releases/tag/v0.0.1