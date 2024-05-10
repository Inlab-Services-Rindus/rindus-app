import { logger } from '@/bootstrap/logger';
import { config } from '@/config';
import { authBackend } from '@/services/auth/auth';
import { importPersonioData } from '@/services/personio/personio';
import { getSlackInfo } from '@/services/slack/slack';

export async function run(isExitNeeded?: boolean) {
  logger.info('Running create-employees task');
  const auth = await authBackend();
  await importPersonioData(config, auth);
  await getSlackInfo(config, auth);
  logger.info('Finished create-employees task');
  if (isExitNeeded) {
    process.exit(0);
  }
}

const arg = process.argv[2];

if (arg === 'cronjob') {
  run(true);
}
