import { Config } from '@/config/config.type';
import { getLocalConfig } from '@/config/local';

describe('local', () => {
  describe('app', () => {
    describe('url', () => {
      it('should keep url value if present', () => {
        const url = 'an url';

        const config = getLocalConfig({
          app: {
            url,
          },
        } as Config);

        expect(config).toEqual(
          expect.objectContaining({
            app: expect.objectContaining({
              url: url,
            }),
          }),
        );
      });

      it('should calculate url value from domain and port', () => {
        const domain = 'domain';
        const port = 1234;
        const config = getLocalConfig({
          app: {
            domain,
            port,
          },
        } as Config);

        expect(config).toEqual(
          expect.objectContaining({
            app: expect.objectContaining({
              url: `http://${domain}:${port}`,
            }),
          }),
        );
      });
    });
  });
});
