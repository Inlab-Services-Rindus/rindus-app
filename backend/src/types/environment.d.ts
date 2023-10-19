import { ProcessVariables } from '@/config/config.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessVariables {}
  }
}

export = ProcessEnv;
