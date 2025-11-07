# Implementation Plan

- [x] 1. Set up RBAC type definitions and core configuration
  - Create TypeScript interfaces for Role, Permission, UserContext, MenuItem, and RouteConfig
  - Define RBAC configuration with role-permission mappings and protected routes
  - Set up Astro locals type extensions for user context
  - _Requirements: 1.1, 2.1, 2.2, 6.3, 7.1_

- [x] 2. Implement core RBAC utility functions
  - [x] 2.1 Create role assignment and permission calculation utilities
    - Write getUserRole function to extract role from Clerk user metadata
    - Implement getUserPermissions function to map roles to permissions
    - Create permission checking helper functions (hasPermission, hasAnyPermission)
    - _Requirements: 1.1, 2.2, 2.4_

  - [x] 2.2 Implement route protection utilities
    - Write isRouteProtected function for middleware route validation
    - Create pattern matching logic for protected and admin routes
    - Implement access control decision logic
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Enhance middleware with RBAC integration
  - Extend existing Clerk middleware to include role assignment
  - Add user context storage in Astro locals
  - Implement route protection checks in middleware
  - Add redirect logic for unauthorized access attempts
  - _Requirements: 1.1, 4.3, 4.4, 4.5, 6.1, 6.2, 6.5_

- [ ] 4. Create template utility functions
  - [x] 4.1 Implement permission checking utilities for templates
    - Write canWriteContent, canEditContent, canManageUser functions
    - Create hasRole and isAdmin helper functions
    - Ensure functions work with Astro locals context
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.3_

  - [x] 4.2 Write unit tests for template utilities
    - Create tests for each permission checking function
    - Test edge cases with undefined user context
    - Verify correct boolean returns for various permission scenarios
    - _Requirements: 3.5, 7.1_

- [-] 5. Build permission-aware menu component
  - [x] 5.1 Create PermissionMenu Astro component
    - Implement menu item filtering based on user permissions
    - Add support for nested menu items with permission inheritance
    - Create shouldShowMenuItem logic for conditional rendering
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 5.2 Write component tests for menu rendering
    - Test menu filtering with different user permission sets
    - Verify correct rendering for authenticated and unauthenticated users
    - Test nested menu item permission handling
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 6. Create error pages and route protection
  - [x] 6.1 Implement 403 Forbidden error page
    - Create user-friendly 403.astro page for permission denied scenarios
    - Add appropriate messaging and navigation options
    - Style page consistently with application design
    - _Requirements: 4.5_

  - [x] 6.2 Set up protected route configuration
    - Define protected routes array with permission requirements
    - Configure admin-only routes list
    - Document route protection patterns for future development
    - _Requirements: 4.1, 4.2_

- [x] 7. Integration and testing setup
  - [x] 7.1 Create example usage implementations
    - Build sample pages demonstrating role-based access (admin, editor, viewer test pages)
    - Implement example menu configurations with permission requirements
    - Create demonstration of template utility usage in components
    - _Requirements: 1.1, 3.4, 5.1, 7.4_

  - [x] 7.2 Write integration tests for RBAC flow
    - Test complete authentication and authorization flow
    - Verify middleware integration with Clerk authentication
    - Test route protection across different user roles
    - _Requirements: 4.3, 4.4, 6.5_

- [x] 8. Documentation and final integration
  - [x] 8.1 Create comprehensive usage documentation
    - Document how to configure roles and permissions
    - Provide examples of template utility usage
    - Create guide for adding new protected routes
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 8.2 Integrate RBAC system with existing application structure
    - Update existing components to use new permission utilities
    - Ensure compatibility with current Clerk integration
    - Verify all imports and exports are properly configured
    - _Requirements: 6.4, 7.5_