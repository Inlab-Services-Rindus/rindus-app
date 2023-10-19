import fs from 'fs';

const RESOURCES_PATH = './seeds/resources';
export const USERS_FILE_NAME = `${RESOURCES_PATH}/users.json`;
export const PARTNERS_FILE_NAME = `${RESOURCES_PATH}/partners.json`;

export function parseFromJSONFile<T>(fileName: string): Omit<T, 'id'>[] {
  return JSON.parse(fs.readFileSync(fileName).toString('utf-8'));
}
