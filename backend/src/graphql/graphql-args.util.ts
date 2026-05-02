/**
 * Map GraphQL list arguments to the same shape as REST query strings for ContentService.findMany.
 */
export function gqlListArgsToQueryRecord(args: {
  status?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  fields?: string;
  filter?: Record<string, unknown>;
}): Record<string, string | string[] | undefined> {
  const q: Record<string, string | string[] | undefined> = {};
  if (args.status != null && args.status !== '') q.status = args.status;
  if (args.limit != null) q.limit = String(args.limit);
  if (args.offset != null) q.offset = String(args.offset);
  if (args.sort != null && args.sort !== '') q.sort = args.sort;
  if (args.fields != null && args.fields !== '') q.fields = args.fields;
  if (
    args.filter != null &&
    typeof args.filter === 'object' &&
    !Array.isArray(args.filter)
  ) {
    q.filter = JSON.stringify(args.filter);
  }
  return q;
}
