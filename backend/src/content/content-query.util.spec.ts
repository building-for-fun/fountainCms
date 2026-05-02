import { BadRequestException } from '@nestjs/common';
import {
  parseContentListQuery,
  parseSort,
  buildJsonFilterConditions,
  MAX_LIMIT,
} from './content-query.util';

const schemaFields = {
  title: { type: 'string' as const },
  count: { type: 'number' as const },
  published: { type: 'boolean' as const },
  tag: {
    type: 'enum' as const,
    options: ['a', 'b'],
  },
};

describe('content-query.util', () => {
  describe('parseSort', () => {
    it('defaults to createdAt desc', () => {
      expect(parseSort(undefined)).toEqual({
        field: 'createdAt',
        direction: 'desc',
      });
    });

    it('parses -field as desc', () => {
      expect(parseSort('-updatedAt')).toEqual({
        field: 'updatedAt',
        direction: 'desc',
      });
    });

    it('parses field:asc', () => {
      expect(parseSort('publishedAt:asc')).toEqual({
        field: 'publishedAt',
        direction: 'asc',
      });
    });

    it('rejects unknown field', () => {
      expect(() => parseSort('invalid')).toThrow(BadRequestException);
    });
  });

  describe('buildJsonFilterConditions', () => {
    it('returns empty when unset', () => {
      expect(buildJsonFilterConditions(undefined, schemaFields)).toEqual([]);
    });

    it('builds equals conditions', () => {
      const cond = buildJsonFilterConditions(
        JSON.stringify({ title: 'Hi', count: 3, published: true }),
        schemaFields,
      );
      expect(cond).toHaveLength(3);
      expect(cond[0]).toMatchObject({
        data: { path: ['title'], equals: 'Hi' },
      });
    });

    it('rejects unknown filter key', () => {
      expect(() =>
        buildJsonFilterConditions(JSON.stringify({ unknown: 1 }), schemaFields),
      ).toThrow(BadRequestException);
    });
  });

  describe('parseContentListQuery', () => {
    it('caps limit', () => {
      const q = parseContentListQuery(
        { limit: String(MAX_LIMIT + 50) },
        schemaFields,
      );
      expect(q.limit).toBe(MAX_LIMIT);
    });

    it('omits limit when not passed', () => {
      const q = parseContentListQuery({}, schemaFields);
      expect(q.limit).toBeUndefined();
    });

    it('parses fields list', () => {
      const q = parseContentListQuery({ fields: 'title,count' }, schemaFields);
      expect(q.fieldPick).toEqual(['title', 'count']);
    });
  });
});
