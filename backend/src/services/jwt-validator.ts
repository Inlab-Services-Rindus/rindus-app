export interface JwtValidator {
  /**
   * @param token JWT representing the user
   * @returns Either the validation error or the user email contained in the JWT
   */
  validateToken: (_token: string) => Promise<string | undefined>;
}
