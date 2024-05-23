import { logger } from '@/bootstrap/logger';
import { config } from '@/config';
import { UserPrograms } from '@/programs/user.programs';
import { authBackend } from '@/services/auth/auth';
import { importPersonioData } from '@/services/personio/personio';
import { getSlackInfo } from '@/services/slack/slack';

export function run(isExitNeeded?: boolean, userPrograms?: UserPrograms) {
  return async () => {
    logger.info('Running create-employees task');
    if (userPrograms) {
      const users = await userPrograms.index(1, 1, true);
      if (users.data.length > 0) {
        logger.warn('Skipping personio sync as employees are already present');
        return;
      }
    }
    const auth = await authBackend();
    await importPersonioData(config, auth);
    await getSlackInfo(config, auth);
    logger.info('Finished create-employees task');
    if (isExitNeeded) {
      process.exit(0);
    }
  };
}

const arg = process.argv[2];

if (arg === 'cronjob') {
  run(true)();
}
