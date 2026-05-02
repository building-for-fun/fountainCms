import { SetMetadata } from '@nestjs/common';
import type { ContentOperation } from '../../content/content-permissions';

export const CONTENT_GRAPHQL_OPERATION_KEY = 'contentGraphqlOperation';

export const RequireContentOperation = (op: ContentOperation) =>
  SetMetadata(CONTENT_GRAPHQL_OPERATION_KEY, op);
