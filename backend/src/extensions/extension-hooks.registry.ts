import { Injectable, Logger } from '@nestjs/common';

/** Third-party / optional modules register hooks here at runtime (OnModuleInit). */
export interface FountainContentHook {
  onContentPublished?(ctx: {
    collection: string;
    entryId: string;
  }): void | Promise<void>;
}

@Injectable()
export class ExtensionHooksRegistry {
  private readonly logger = new Logger(ExtensionHooksRegistry.name);
  private readonly hooks = new Set<FountainContentHook>();

  register(hook: FountainContentHook): void {
    this.hooks.add(hook);
  }

  async notifyContentPublished(ctx: {
    collection: string;
    entryId: string;
  }): Promise<void> {
    await Promise.allSettled(
      [...this.hooks].map((h) =>
        Promise.resolve(h.onContentPublished?.(ctx)).catch((err: unknown) => {
          this.logger.warn(
            `Extension hook onContentPublished failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }),
      ),
    );
  }
}
