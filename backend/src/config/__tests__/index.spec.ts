import { Config } from '../config.type';
import { isLiveEnvironment } from '..';

jest.mock('../development', () => {
  return {
    getDevelopmentConfig: jest.fn(
      () =>
        ({
          developmentConfig: 'mocked',
        }) as Partial<Config>,
    ),
  };
});

jest.mock('../production', () => {
  return {
    getProductionConfig: jest.fn(
      () =>
        ({
          productionConfig: 'mocked',
        }) as Partial<Config>,
    ),
  };
});

jest.mock('../local', () => {
  return {
    getLocalConfig: jest.fn(
      () =>
        ({
          localConfig: 'mocked',
        }) as Partial<Config>,
    ),
  };
});

jest.mock('../common', () => {
  return {
    getCommonConfig: jest.fn(() => ({
      commonConfig: 'mocked',
    })),
  };
});

describe('getConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it.each`
    environment      | expectedConfig
    ${'development'} | ${'developmentConfig'}
    ${'production'}  | ${'productionConfig'}
    ${'local'}       | ${'localConfig'}
  `(
    'should return the correct config for $environment environment',
    ({ environment, expectedConfig }) => {
      process.env.NODE_ENV = environment;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('../../config');

      const result = config;

      expect(result).toEqual({
        config: {
          commonConfig: 'mocked',
          [expectedConfig]: 'mocked',
        },
        isLiveEnvironment: expect.any(Function),
      });
    },
  );
});

describe('isLiveEnvironment', () => {
  it.each`
    environment      | expected
    ${'development'} | ${true}
    ${'production'}  | ${true}
    ${'local'}       | ${false}
  `(
    'should return $expected for $environment environment',
    ({ environment, expected }) => {
      const config = { environment } as unknown as Config;
      expect(isLiveEnvironment(config)).toBe(expected);
    },
  );
});
