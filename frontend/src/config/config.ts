import { devConfig, prodConfig } from '@/config/environments';

import { AppConfig } from 'src/model/Config';

type Mode = 'development' | 'production' | 'mock';

function getConfig(mode: Mode): AppConfig {
  let config;
  switch (mode) {
    case 'production':
      config = prodConfig();
      break;
    default:
      config = devConfig();
  }

  return config;
}

export const config = getConfig(import.meta.env.MODE as Mode);
