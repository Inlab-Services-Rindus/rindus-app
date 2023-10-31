import fs from 'fs';

import { PersonioData } from '@/models/service/seeds/Personio';

const RESOURCES_PATH = './seeds/resources';
export const USERS_FILE_NAME = `${RESOURCES_PATH}/users.json`;
export const PERSONIO_USERS_FILE_NAME = `${RESOURCES_PATH}/personio-users.json`;

export function parsePersonioJSONFile(): PersonioData {
  if (fs.existsSync(PERSONIO_USERS_FILE_NAME)) {
    return parseJSON(PERSONIO_USERS_FILE_NAME);
  } else {
    return parseJSON(USERS_FILE_NAME);
  }
}

function parseJSON<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(fileName).toString('utf-8'));
}
