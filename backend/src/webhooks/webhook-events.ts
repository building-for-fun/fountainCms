export const WEBHOOK_EVENTS = {
  CONTENT_ENTRY_CREATED: 'content.entry.created',
  CONTENT_ENTRY_UPDATED: 'content.entry.updated',
  CONTENT_ENTRY_DELETED: 'content.entry.deleted',
  CONTENT_ENTRY_ALL: 'content.entry.*',
} as const;

export type WebhookEventType =
  (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

export const KNOWN_WEBHOOK_EVENTS: readonly string[] = [
  WEBHOOK_EVENTS.CONTENT_ENTRY_CREATED,
  WEBHOOK_EVENTS.CONTENT_ENTRY_UPDATED,
  WEBHOOK_EVENTS.CONTENT_ENTRY_DELETED,
  WEBHOOK_EVENTS.CONTENT_ENTRY_ALL,
];

export function subscriptionMatchesEvent(
  subscribed: readonly string[],
  event: string,
): boolean {
  if (subscribed.includes(WEBHOOK_EVENTS.CONTENT_ENTRY_ALL)) return true;
  return subscribed.includes(event);
}
