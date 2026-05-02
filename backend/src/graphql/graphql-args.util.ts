/**
 * Map GraphQL list arguments to the same shape as REST query strings for ContentService.findMany.
 */
export function gqlListArgsToQueryRecord(args: {
  status?: string;
  locale?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  fields?: string;
  populate?: string;
  filter?: Record<string, unknown>;
}): Record<string, string | string[] | undefined> {
  const q: Record<string, string | string[] | undefined> = {};
  if (args.status != null && args.status !== '') q.status = args.status;
  if (args.locale != null && args.locale !== '') q.locale = args.locale;
  if (args.limit != null) q.limit = String(args.limit);
  if (args.offset != null) q.offset = String(args.offset);
  if (args.sort != null && args.sort !== '') q.sort = args.sort;
  if (args.fields != null && args.fields !== '') q.fields = args.fields;
  if (args.populate != null && args.populate !== '') q.populate = args.populate;
  if (
    args.filter != null &&
    typeof args.filter === 'object' &&
    !Array.isArray(args.filter)
  ) {
    q.filter = JSON.stringify(args.filter);
  }
  return q;
}
