import { Prisma } from '@prisma/client';
import { FieldSchema } from '../schema/schema.types';
import { BadRequestException } from '@nestjs/common';

export function assertObject(value: Prisma.JsonValue): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Invalid content data shape');
  }

  return value as Record<string, unknown>;
}

export function validatePayload(
  payload: Record<string, unknown>,
  fields: Record<string, FieldSchema>,
) {
  const result: Record<string, unknown> = {};

  // 1️⃣ Reject unknown fields
  for (const key of Object.keys(payload)) {
    if (!fields[key]) {
      throw new BadRequestException(`Unknown field '${key}'`);
    }
  }

  // 2️⃣ Validate known fields
  for (const [fieldName, fieldSchema] of Object.entries(fields)) {
    const value = payload[fieldName];

    if (value === undefined) {
      if (fieldSchema.required) {
        throw new BadRequestException(`Field '${fieldName}' is required`);
      }

      if (fieldSchema.default !== undefined) {
        result[fieldName] = fieldSchema.default;
      }

      continue;
    }

    // 3️⃣ Type validation (minimal)
    switch (fieldSchema.type) {
      case 'string':
      case 'text':
        if (typeof value !== 'string') {
          throw new BadRequestException(
            `Field '${fieldName}' must be a string`,
          );
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          throw new BadRequestException(
            `Field '${fieldName}' must be a number`,
          );
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new BadRequestException(
            `Field '${fieldName}' must be a boolean`,
          );
        }
        break;
      case 'enum': {
        const options = fieldSchema.options;

        if (!Array.isArray(options)) {
          throw new BadRequestException(
            `Enum field '${fieldName}' must define options[] in schema`,
          );
        }

        if (!options.includes(value as string)) {
          throw new BadRequestException(
            `Field '${fieldName}' must be one of ${options.join(', ')}`,
          );
        }

        break;
      }
    }

    result[fieldName] = value;
  }

  return result;
}
