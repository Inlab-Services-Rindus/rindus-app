import fs from 'fs';

import { connectTestDatabase } from '@/bootstrap/database';
import { TestDatabaseFileName } from '@/bootstrap/database/knex';

export default async (globalConfig: { testPathPattern: string }) => {
  if (globalConfig.testPathPattern !== 'int') {
    // No database needed for unit tests
    return;
  }

  await connectTestDatabase().destroy();

  if (fs.existsSync(TestDatabaseFileName)) {
    fs.rmSync(TestDatabaseFileName);
  }

  console.log('Database removed succesfully');
  process.exit(0);
};
