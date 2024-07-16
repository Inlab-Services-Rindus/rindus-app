import { Request, Response } from 'express';

import { GooglePrograms } from '@/programs/google.programs';
import NodeCache from 'node-cache';

type CacheKey = string;

export class GoogleController {
  private readonly googlePrograms: GooglePrograms;
  private readonly eventsCache: NodeCache;

  constructor(googlePrograms: GooglePrograms, eventsCache: NodeCache) {
    this.googlePrograms = googlePrograms;
    this.eventsCache = eventsCache;
  }

  public async events(_request: Request, response: Response) {
    const events = await this.googlePrograms.events();

    if (events?.length > 0) {
      return response.send(events);
    }

    return response.sendStatus(404);
  }

  public async event(request: Request, response: Response) {
    const eventId = request?.params?.eventId;

    const event = await this.googlePrograms.event(eventId);

    if (event) {
      return response.send(event);
    }

    return response.sendStatus(404);
  }

  public async attendees(request: Request, response: Response) {
    const eventId = request?.params?.eventId;
    const userId = request.session?.userId;

    if (eventId && userId) {
      const cacheKey = this.calculateCacheKey(eventId);

      let attendees;
      if (cacheKey != null) {
        const cached = this.eventsCache.get(cacheKey);
        attendees = cached;

        if (!cached) {
          attendees = await this.googlePrograms.attendees(userId, eventId);
          this.eventsCache.set(cacheKey, attendees);
        }
      }

      if (attendees) {
        return response.send(attendees);
      }
    }

    return response.sendStatus(404);
  }

  private calculateCacheKey(eventId: string): CacheKey | null {
    if (!eventId || eventId.trim().length == 0) {
      return null;
    }

    return `attendees-${eventId}`;
  }
}
