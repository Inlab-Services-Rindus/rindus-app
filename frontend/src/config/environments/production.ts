import { AppConfig } from '@/model/Config';

const backendUrl = import.meta.env.BACKEND_URL;

export const prodConfig = (): AppConfig => ({
  backendUrl,
});
