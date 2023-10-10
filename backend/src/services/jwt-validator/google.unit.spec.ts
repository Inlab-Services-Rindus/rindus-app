import { JwtValidator } from '@/services/jwt-validator';
import { GoogleJwtValidator } from '@/services/jwt-validator/google';

const emailMock = 'test@rindus.de';
const payloadMock = { hd: 'rindus.de', email: emailMock };
const mockGetPayload = jest.fn().mockReturnValue(payloadMock);

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(() => ({
    verifyIdToken: jest.fn(() =>
      Promise.resolve({
        getPayload: mockGetPayload,
      }),
    ),
  })),
}));

describe('GoogleJwtValidator', () => {
  let googleJwtValidator: JwtValidator;

  beforeAll(() => {
    googleJwtValidator = new GoogleJwtValidator();
  });

  describe('validateToken', () => {
    const token = 'foo';
    it('should return email when the token is correct', async () => {
      const email = await googleJwtValidator.validateToken(token);

      expect(email).toEqual(emailMock);
    });

    it('should return undefined if issuer is not valid', async () => {
      mockGetPayload.mockReturnValueOnce({
        ...payloadMock,
        hd: 'bad-issuer.com',
      });

      const email = await googleJwtValidator.validateToken(token);

      expect(email).toEqual(undefined);
    });

    it('should return undefined if email not included', async () => {
      mockGetPayload.mockReturnValueOnce({
        ...payloadMock,
        email: undefined,
      });

      const email = await googleJwtValidator.validateToken(token);

      expect(email).toEqual(undefined);
    });

    it('should return undefined if no payload', async () => {
      mockGetPayload.mockReturnValueOnce(undefined);

      const email = await googleJwtValidator.validateToken(token);

      expect(email).toEqual(undefined);
    });

    it('should return undefined if exception', async () => {
      mockGetPayload.mockImplementation(() => {
        throw Error;
      });

      const email = await googleJwtValidator.validateToken(token);

      expect(email).toEqual(undefined);
    });
  });
});
