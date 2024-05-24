import { personioSyncService } from '@/bootstrap';
import { logger } from '@/bootstrap/logger';
import { config } from '@/config';
import { UserPrograms } from '@/programs/user.programs';
import { Employee } from '@/services/personio/personio';
import { getPersonioData } from '@/services/personio/scraping';
import { requestSlackInfo } from '@/services/slack/slack';

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

    let personioData = [] as Employee[];
    try {
      personioData = await getPersonioData(config);
    } catch (e) {
      logger.warn('Error while trying to obtain personio data', e);
    }

    await personioSyncService.importPersonioData(personioData);
    await personioSyncService.updatePersonioData(personioData);

    let slackInfo;
    try {
      slackInfo = await requestSlackInfo(config);
    } catch (e) {
      logger.warn('Error while trying to obtain slack data', e);
    }
    if (slackInfo) {
      // await createSlackInfo(config, auth, slackInfo);
      // await updateSlackInfo(config, auth, slackInfo);
    }
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
