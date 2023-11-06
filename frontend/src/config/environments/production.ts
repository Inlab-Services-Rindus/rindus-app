import { AppConfig } from '@/model/Config';

const backendUrl = import.meta.env.BACKEND_URL;

console.log('Pedro ===> backendUrl', backendUrl);


export const prodConfig = (): AppConfig => ({
  backendUrl,
});
