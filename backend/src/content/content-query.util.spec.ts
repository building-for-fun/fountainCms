import { BadRequestException } from '@nestjs/common';
import {
  parseContentListQuery,
  parsePopulate,
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

const relationSchemaFields = {
  ...schemaFields,
  authorId: {
    type: 'relation' as const,
    relationCollection: 'authors',
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

    it('normalizes datetime filter values to ISO', () => {
      const cond = buildJsonFilterConditions(
        JSON.stringify({ created: '2024-01-15T00:00:00.000Z' }),
        {
          created: { type: 'datetime' as const },
        },
      );
      expect(cond).toHaveLength(1);
      expect(cond[0]).toMatchObject({
        data: { path: ['created'], equals: '2024-01-15T00:00:00.000Z' },
      });
    });
  });

  describe('parsePopulate', () => {
    it('returns null when unset', () => {
      expect(parsePopulate(undefined, relationSchemaFields)).toBeNull();
    });

    it('expands * to all relation fields', () => {
      expect(parsePopulate('*', relationSchemaFields)).toEqual(['authorId']);
    });

    it('parses comma-separated relation names', () => {
      expect(parsePopulate('authorId', relationSchemaFields)).toEqual([
        'authorId',
      ]);
    });

    it('rejects non-relation field name', () => {
      expect(() => parsePopulate('title', relationSchemaFields)).toThrow(
        BadRequestException,
      );
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
      expect(q.populate).toBeNull();
    });

    it('parses fields list', () => {
      const q = parseContentListQuery({ fields: 'title,count' }, schemaFields);
      expect(q.fieldPick).toEqual(['title', 'count']);
    });

    it('parses populate', () => {
      const q = parseContentListQuery(
        { populate: 'authorId' },
        relationSchemaFields,
      );
      expect(q.populate).toEqual(['authorId']);
    });
  });
});
