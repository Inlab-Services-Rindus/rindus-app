import { Event } from '@/models/business/Google';
import { google } from 'googleapis';
import { config } from '@/config';
import { GoogleRepository as GoogleRepositoryInterface } from '@/models/service/google/google.repository';
import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

export class GoogleRepository implements GoogleRepositoryInterface {
  private auth: GoogleAuth<JSONClient> | undefined;

  constructor() {
    this.auth = undefined;
    this.setAuth();
  }

  private async setAuth() {
    const SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive',
    ];

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(config.googleAuthCredentials),
      scopes: SCOPES,
    });

    this.auth = auth;
  }

  public async events(): Promise<Event[]> {
    const response = await google.calendar('v3').events.list({
      auth: this.auth,
      calendarId: 'info@rindus.de',
      timeMin: '2024-01-01T10:00:00-07:00',
      showDeleted: true, //This param works in reverse mode, true means it will not show deleted events
    });

    const events = response.data.items as Event[];

    return events;
  }
}
