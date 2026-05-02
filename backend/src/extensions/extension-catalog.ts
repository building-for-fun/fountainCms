import { Logger, type Type } from '@nestjs/common';
import { ExampleExtensionModule } from './builtins/example.extension.module';

export type FountainExtensionCatalogEntry = {
  /** Short stable id (env EXTENSIONS_ENABLED). */
  id: string;
  description: string;
  module: Type<unknown>;
};

/** Built-in extensions shipped with the core (whitelist only — no arbitrary code load). */
export const EXTENSION_CATALOG: Record<string, FountainExtensionCatalogEntry> =
  {
    example: {
      id: 'example',
      description:
        'Demonstrates extension loading and registers a sample content-published hook.',
      module: ExampleExtensionModule,
    },
  };

const logger = new Logger('Extensions');

export function resolveExtensionModules(
  enabledIds: readonly string[],
): Type<unknown>[] {
  const seen = new Set<string>();
  const modules: Type<unknown>[] = [];
  for (const raw of enabledIds) {
    const id = raw.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const entry = EXTENSION_CATALOG[id];
    if (!entry) {
      logger.warn(
        `Unknown EXTENSIONS_ENABLED entry "${id}" — skipped (see EXTENSION_CATALOG).`,
      );
      continue;
    }
    modules.push(entry.module);
  }
  return modules;
}

export function catalogEntries(): FountainExtensionCatalogEntry[] {
  return Object.values(EXTENSION_CATALOG);
}
