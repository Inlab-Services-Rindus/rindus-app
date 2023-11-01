import { getCommonConfig } from '@/config/common';
import { ProcessVariables } from '@/config/config.type';

describe('common', () => {
  describe('app', () => {
    describe('url', () => {
      it('should keep env value if present', () => {
        const envUrl = 'an url';

        const config = getCommonConfig({
          URL: envUrl,
        } as ProcessVariables);

        expect(config).toEqual(
          expect.objectContaining({
            app: expect.objectContaining({
              url: envUrl,
            }),
          }),
        );
      });

      it('should keep undefined if no value present', () => {
        const config = getCommonConfig({} as ProcessVariables);

        expect(config).toEqual(
          expect.objectContaining({
            app: expect.objectContaining({
              url: undefined,
            }),
          }),
        );
      });
    });
  });
});
