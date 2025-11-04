<!--
Sync Impact Report:
Version change: 1.0.0 (new constitution)
Modified principles: N/A (initial creation)
Added sections: All sections newly created
Removed sections: N/A
Templates requiring updates: 
  ✅ plan-template.md - Constitution Check section exists
  ✅ spec-template.md - Aligns with requirements focus
  ✅ tasks-template.md - Updated testing requirements to match constitution (mandatory TDD)
Follow-up TODOs: None
-->

# Clerk Authentication App Constitution

## Core Principles

### I. Code Quality First (NON-NEGOTIABLE)
All code MUST adhere to established formatting, linting, and type safety standards. TypeScript strict mode is mandatory; no `any` types except for explicit third-party integration points. Prettier formatting is automatically enforced. ESLint violations block deployment. Components MUST be self-contained with clear prop interfaces and comprehensive JSDoc documentation.

**Rationale**: Consistency reduces cognitive load, prevents bugs, and enables confident refactoring in a TypeScript/Vue/Astro stack.

### II. Test-Driven Development (NON-NEGOTIABLE)
Tests MUST be written before implementation. End-to-end tests using Playwright validate user journeys. Unit tests using Vitest cover business logic. Integration tests verify authentication flows and API contracts. All tests MUST pass before merge; no exceptions.

**Rationale**: TDD ensures requirements are clear, implementation is testable, and regression prevention is built-in from day one.

### III. User Experience Consistency
UI components MUST follow the established design system using shadcn-vue components. Accessibility standards (WCAG 2.1 AA) are mandatory. Loading states, error handling, and responsive design are required for all user-facing features. Dark/light mode support is non-negotiable.

**Rationale**: Consistent UX builds user trust and reduces support burden; accessibility ensures inclusive design.

### IV. Performance Standards
Page load times MUST be under 2 seconds on 3G networks. Core Web Vitals MUST score "Good" (LCP < 2.5s, FID < 100ms, CLS < 0.1). Astro's partial hydration MUST be leveraged for optimal performance. Bundle sizes are monitored and optimized continuously.

**Rationale**: Performance directly impacts user satisfaction and business metrics; SSG/SSR with selective hydration is our competitive advantage.

### V. Security & Authentication
Clerk authentication patterns MUST be followed consistently. No custom authentication logic outside Clerk APIs. Protected routes MUST verify authentication server-side via middleware. User data handling MUST comply with privacy principles (data minimization, purpose limitation).

**Rationale**: Security breaches are catastrophic; standardizing on Clerk reduces attack surface and ensures best practices.

## Technology Standards

**Framework Stack**: Astro 5+ with Vue 3.5+ for interactive components, TypeScript strict mode, Tailwind CSS 4+ for styling
**Testing Stack**: Playwright for E2E, Vitest for unit tests, @clerk/testing for auth flows
**Code Quality**: Prettier formatting, ESLint with TypeScript rules, strict null checks enabled
**Performance**: Astro SSG/SSR with selective Vue hydration, Core Web Vitals monitoring
**Authentication**: Clerk integration with server-side route protection via middleware

## Development Workflow

**Branch Strategy**: Feature branches from main, PR-based reviews required
**Code Review**: All PRs MUST pass automated checks (tests, linting, type checking) and human review
**Testing Gates**: E2E tests run on PR, unit tests run on every commit, integration tests verify auth flows
**Deployment**: Automated builds triggered by main branch merges, staging environment for final validation
**Documentation**: Feature specs precede implementation, ADRs document significant technical decisions

## Governance

This constitution supersedes all other development practices. Amendments require documented justification and team consensus. All PRs MUST verify compliance with these principles. Complexity violations require explicit rationale and simpler alternative consideration. 

Development guidance is maintained in project README and build documentation for day-to-day reference.

**Version**: 1.0.0 | **Ratified**: 2025-11-04 | **Last Amended**: 2025-11-04
