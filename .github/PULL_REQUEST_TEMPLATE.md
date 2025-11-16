# Pull Request

## Description

<!-- This PR integrates Swagger API documentation into the FountainCMS backend (NestJS).

### Changes Made:

- Added `@nestjs/swagger` and `swagger-ui-express` dependencies to `backend/package.json`
- Configured Swagger UI at `/api` endpoint with comprehensive API documentation
- Created DTO files for robust schema documentation:
  - `ContentDto`, `ContentItemDto`, `ContentListDto` in `content-details.model.ts`
  - `RoleDetails` in `role-details.model.ts`
  - `UserDetailsDto` in `user-details.model.ts`
- Updated all three controllers with Swagger decorators (`@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiBody`, `@ApiTags`)
- All endpoints are now visible and testable through the interactive Swagger UI

### Benefits:

- Improved developer onboarding with interactive API documentation
- Clear API contracts and data schemas
- Simplified manual API testing without external tools
- Auto-updated documentation that stays synchronized with code changes -->

## Fixes #20


## Type of Change

  [ ] Bug fix
- [ ] New feature
  [ ] Breaking change
- [ ] Documentation update
  [ ] Refactor
  [ ] Other (please describe):

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Screenshots (if applicable)


## Additional Context

<!-- Add any other context about the PR here. -->