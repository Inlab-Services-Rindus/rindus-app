import { AppConfig } from '@/config/config';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const prodConfig = (): AppConfig => ({
  backendUrl,
});
