import { Request, Response } from 'express';

import { GooglePrograms } from '@/programs/google.programs';

export class GoogleController {
  private readonly googlePrograms: GooglePrograms;

  constructor(googlePrograms: GooglePrograms) {
    this.googlePrograms = googlePrograms;
  }

  public async events(_request: Request, response: Response) {
    const events = await this.googlePrograms.events();

    if (events?.length > 0) {
      return response.send(events);
    }

    return response.sendStatus(404);
  }
}
