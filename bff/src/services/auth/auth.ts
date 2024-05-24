import { Config } from '@/config/config.type';
export interface Auth {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export class AuthService {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async getToken(): Promise<Auth> {
    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('client_id', this.config.api.auth.clientId);
    urlencoded.append('client_secret', this.config.api.auth.clienSecret);

    const response = await fetch(`${this.config.api.url}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded,
    });

    const data: Auth = await response.json();

    return data;
  }
}
