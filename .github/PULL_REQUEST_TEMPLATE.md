# Pull Request

Thank you for contributing to FountainCMS! Please fill out this template to help us review your PR efficiently.

## Description

This PR integrates Swagger API documentation into the FountainCMS backend (NestJS).

Added @nestjs/swagger and configured Swagger UI at /api/docs

Defined and annotated DTO files (ContentDto, ContentItemDto, and ContentListDto) for robust schema documentation

Updated the content controller , user controller , roles controller with comprehensive Swagger decorators (@ApiOperation, @ApiResponse, etc.)

All current endpoints (GET /api/content, GET /api/content/:key, POST /api/content) are visible and testable within the documentation interface

This change improves onboarding for developers, ensures API contract clarity, and simplifies manual testing.

Fixes # (issue)

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [x] Documentation update
- [ ] Refactor
- [ ] Other (please describe):

## Checklist

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules

## Screenshots (if applicable)


## Additional Context

<!-- Add any other context about the PR here. -->
