export interface Event {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  location?: string;
  creator: {
    email: string;
    displayName?: string;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence?: string[];
  iCalUID: string;
  sequence: number;
  guestsCanInviteOthers?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
}
