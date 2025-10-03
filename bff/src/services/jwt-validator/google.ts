import { logger } from '@/bootstrap/logger';
import { OAuth2Client } from 'google-auth-library';

import { config } from '@/config';
import { JwtValidator } from '@/services/jwt-validator';

export class GoogleJwtValidator implements JwtValidator {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client();
  }

  public async validateToken(token: string): Promise<string | undefined> {
    let payload = undefined;
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.app.google.clientIds,
      });
      payload = ticket.getPayload();
    } catch (error) {
      logger.error(error);

      return undefined;
    }

    logger.debug(
      `Received token id: ${payload?.sub} email: ${payload?.email} issuer: ${payload?.hd}`,
    );

    if (!payload) {
      logger.warn('Unusable token, payload was empty');

      return undefined;
    }

    const { email, hd: issuer } = payload;

    if (issuer !== 'rindus.de') {
      logger.warn('Issuer was not authorized');

      return undefined;
    }

    if (!email) {
      logger.warn('Email was not included');

      return undefined;
    }

    return email;
  }
}
