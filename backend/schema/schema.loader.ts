import * as fs from 'fs';
import * as path from 'path';

import { AppSchema } from '../src/schema/schema.types';

export function loadSchema(): AppSchema {
  const schemaPath = path.join(process.cwd(), 'schema/schema.json');

  const raw = fs.readFileSync(schemaPath, 'utf-8');
  return JSON.parse(raw) as AppSchema;
}
