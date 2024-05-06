import { calendar_v3, google } from 'googleapis';
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

  public async events(): Promise<calendar_v3.Schema$Events[]> {
    const response = await google.calendar('v3').events.list({
      auth: this.auth,
      calendarId: 'info@rindus.de',
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
      orderBy: 'startTime',
      singleEvents: true,
      showDeleted: true, //This param works in reverse mode, true means it will not show deleted events
    });

    const events = response?.data?.items ?? [];

    const eventsWithoutWeekly = events.filter(
      (event) => !event?.summary?.includes('Weekly'),
    );

    return eventsWithoutWeekly;
  }

  public async event(eventId: string): Promise<calendar_v3.Schema$Event> {
    const response = await google.calendar('v3').events.get({
      auth: this.auth,
      calendarId: 'info@rindus.de',
      eventId: eventId,
    });

    const event = response?.data;

    return event;
  }
}
