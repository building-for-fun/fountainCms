import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import type { FieldSchema } from '../schema/schema.types';

export const MAX_LIMIT = 100;

export type SortableColumn = 'createdAt' | 'updatedAt' | 'publishedAt';

export interface ParsedListQuery {
  /** Undefined means no limit (return all matching rows). */
  limit: number | undefined;
  offset: number;
  sort: { field: SortableColumn; direction: 'asc' | 'desc' };
  filterAnd: Prisma.ContentItemWhereInput[];
  /** Null = full payload; otherwise only these schema field keys (plus id, status, published_at). */
  fieldPick: string[] | null;
}

export function firstQueryValue(
  raw: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = raw[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

function parseLimit(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === '') return undefined;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    throw new BadRequestException('limit must be a positive integer');
  }
  return Math.min(n, MAX_LIMIT);
}

function parseOffset(raw: string | undefined): number {
  if (raw === undefined || raw === '') return 0;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) {
    throw new BadRequestException('offset must be a non-negative integer');
  }
  return n;
}

export function parseSort(raw: string | undefined): {
  field: SortableColumn;
  direction: 'asc' | 'desc';
} {
  const DEFAULT = {
    field: 'createdAt' as SortableColumn,
    direction: 'desc' as const,
  };
  if (!raw?.trim()) return DEFAULT;

  const s = raw.trim();
  let fieldStr: string;
  let direction: 'asc' | 'desc';

  if (s.startsWith('-')) {
    fieldStr = s.slice(1).trim();
    direction = 'desc';
  } else if (s.includes(':')) {
    const [f, d] = s.split(':');
    fieldStr = (f ?? '').trim();
    const dl = (d ?? '').trim().toLowerCase();
    if (dl !== 'asc' && dl !== 'desc') {
      throw new BadRequestException(
        `Invalid sort direction "${d}"; use asc or desc`,
      );
    }
    direction = dl;
  } else {
    fieldStr = s;
    direction = 'asc';
  }

  const allowed: SortableColumn[] = ['createdAt', 'updatedAt', 'publishedAt'];
  if (!allowed.includes(fieldStr as SortableColumn)) {
    throw new BadRequestException(
      `sort must be one of: ${allowed.join(', ')} (prefix with - for desc, or use field:asc|desc)`,
    );
  }

  return { field: fieldStr as SortableColumn, direction };
}

function coerceFilterValue(
  value: unknown,
  fieldName: string,
  field: FieldSchema,
): Prisma.InputJsonValue {
  switch (field.type) {
    case 'string':
    case 'text':
    case 'media':
    case 'relation':
      if (typeof value !== 'string') {
        throw new BadRequestException(
          `Filter for '${fieldName}' must be a string`,
        );
      }
      return value;

    case 'number': {
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string' && value.trim() !== '') {
        const n = Number(value);
        if (Number.isFinite(n)) return n;
      }
      throw new BadRequestException(
        `Filter for '${fieldName}' must be a finite number`,
      );
    }

    case 'boolean': {
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new BadRequestException(
        `Filter for '${fieldName}' must be a boolean`,
      );
    }

    case 'enum': {
      const options = field.options;
      if (!Array.isArray(options)) {
        throw new BadRequestException(
          `Enum field '${fieldName}' has no options`,
        );
      }
      if (typeof value !== 'string' || !options.includes(value)) {
        throw new BadRequestException(
          `Filter for '${fieldName}' must be one of: ${options.join(', ')}`,
        );
      }
      return value;
    }

    case 'datetime':
      if (typeof value !== 'string' || !value.trim()) {
        throw new BadRequestException(
          `Filter for '${fieldName}' must be a non-empty string (e.g. ISO-8601)`,
        );
      }
      return value;

    default:
      throw new BadRequestException(
        `Filtering is not supported for field type '${field.type}' (${fieldName})`,
      );
  }
}

export function buildJsonFilterConditions(
  filterRaw: string | undefined,
  schemaFields: Record<string, FieldSchema>,
): Prisma.ContentItemWhereInput[] {
  if (!filterRaw?.trim()) return [];

  let obj: unknown;
  try {
    obj = JSON.parse(filterRaw) as unknown;
  } catch {
    throw new BadRequestException('filter must be valid JSON');
  }

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new BadRequestException('filter must be a JSON object');
  }

  const record = obj as Record<string, unknown>;
  const conditions: Prisma.ContentItemWhereInput[] = [];

  for (const [key, value] of Object.entries(record)) {
    const field = schemaFields[key];
    if (!field) {
      throw new BadRequestException(`Unknown filter field: ${key}`);
    }
    const coerced = coerceFilterValue(value, key, field);
    conditions.push({
      data: {
        path: [key],
        equals: coerced,
      },
    });
  }

  return conditions;
}

export function parseFieldsList(
  raw: string | undefined,
  schemaFields: Record<string, FieldSchema>,
): string[] | null {
  if (!raw?.trim()) return null;
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  for (const p of parts) {
    if (!schemaFields[p]) {
      throw new BadRequestException(`Unknown field in fields: ${p}`);
    }
  }
  return parts;
}

export function parseContentListQuery(
  raw: Record<string, string | string[] | undefined>,
  schemaFields: Record<string, FieldSchema>,
): ParsedListQuery {
  const limit = parseLimit(firstQueryValue(raw, 'limit'));
  const offset = parseOffset(firstQueryValue(raw, 'offset'));
  const sort = parseSort(firstQueryValue(raw, 'sort'));
  const filterAnd = buildJsonFilterConditions(
    firstQueryValue(raw, 'filter'),
    schemaFields,
  );
  const fieldPick = parseFieldsList(
    firstQueryValue(raw, 'fields'),
    schemaFields,
  );

  return { limit, offset, sort, filterAnd, fieldPick };
}

export function pickContentFields(
  row: Record<string, unknown>,
  pick: string[] | null,
): Record<string, unknown> {
  if (!pick) return row;
  const out: Record<string, unknown> = {
    id: row.id,
    status: row.status,
    published_at: row.published_at,
  };
  for (const k of pick) {
    if (k in row) out[k] = row[k];
  }
  return out;
}
