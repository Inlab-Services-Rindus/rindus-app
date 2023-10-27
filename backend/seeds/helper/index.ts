import fs from 'fs';

import { PersonioData } from '@/models/service/seeds/Personio';

const RESOURCES_PATH = './seeds/resources';
export const USERS_FILE_NAME = `${RESOURCES_PATH}/users.json`;
export const PARTNERS_FILE_NAME = `${RESOURCES_PATH}/partners.json`;

export function parseFromSeedJSONFile<T>(fileName: string): T[] {
  return parseJSON(fileName);
}

export function parsePersonioJSONFile(): PersonioData {
  return parseJSON(USERS_FILE_NAME);
}

function parseJSON<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(fileName).toString('utf-8'));
}
