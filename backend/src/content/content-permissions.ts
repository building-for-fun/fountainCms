/**
 * Content API permission format: "{collection}:{operation}"
 * Operations: create, read, update, delete
 * Wildcards: "{collection}:*" (all ops for collection), "*:*" (all content)
 */

export const CONTENT_OPERATIONS = [
  'create',
  'read',
  'update',
  'delete',
] as const;
export type ContentOperation = (typeof CONTENT_OPERATIONS)[number];

const METHOD_TO_OPERATION: Record<string, ContentOperation> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

export function getRequiredContentPermission(
  collection: string,
  method: string,
): string {
  const op = METHOD_TO_OPERATION[method] ?? 'read';
  return `${collection}:${op}`;
}

export function hasContentPermission(
  permissions: string[],
  collection: string,
  operation: ContentOperation,
): boolean {
  const required = `${collection}:${operation}`;
  return permissions.some((p) => {
    if (p === required) return true;
    if (p === `${collection}:*`) return true;
    if (p === '*:*') return true;
    return false;
  });
}
