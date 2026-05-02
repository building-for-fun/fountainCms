import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS_PUBLISHED_KEY = 'allowAnonymousPublishedRead';

/** Allows unauthenticated GET with published content only (see JwtAuthGuard + ContentController). */
export const AllowAnonymousPublishedRead = () =>
  SetMetadata(ALLOW_ANONYMOUS_PUBLISHED_KEY, true);
