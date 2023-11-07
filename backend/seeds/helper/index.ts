import fs from 'fs';

import { PersonioData } from '@/models/service/seeds/Personio';
import { SlackData } from '@/models/service/seeds/Slack';

const RESOURCES_PATH = './seeds/resources';
const PROD_PATH = '/production';
const USERS_FILE_NAME = '/users.json';
const SLACK_FILE_NAME = '/slack.json';

export function parsePersonioJSONFile(): PersonioData {
  return parseJSONFile(USERS_FILE_NAME);
}

export function parseSlackJSONFile(): SlackData {
  return parseJSONFile(SLACK_FILE_NAME);
}

function parseJSONFile<T>(filename: string): T {
  const devFilename = devFile(filename);
  const productionFilename = productionFile(filename);
  if (fs.existsSync(productionFilename)) {
    return parseJSON<T>(productionFilename);
  } else {
    return parseJSON<T>(devFilename);
  }
}

function devFile(filename: string) {
  return `${RESOURCES_PATH}${filename}`;
}

function productionFile(filename: string) {
  return `${RESOURCES_PATH}${PROD_PATH}${filename}`;
}

function parseJSON<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(fileName).toString('utf-8'));
}
