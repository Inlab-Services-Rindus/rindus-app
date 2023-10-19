import { JwtValidator } from '@/services/jwt-validator';

export const mockValidateToken = jest.fn().mockResolvedValue('email');

export class MockJwtValidator implements JwtValidator {
  validateToken: (_token: string) => Promise<string | undefined> =
    mockValidateToken;
}
