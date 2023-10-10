import { connectTestDatabase } from '@/bootstrap/database';

export default async (globalConfig: { testPathPattern: string }) => {
  if (globalConfig.testPathPattern !== 'int') {
    // No database needed for unit tests
    return;
  }

  await connectTestDatabase().migrate.latest();

  console.log('Database started and migrated succesfully');
};
