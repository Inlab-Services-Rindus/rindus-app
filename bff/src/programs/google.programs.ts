import { GoogleRepository } from '@/models/service/google/google.repository';
import {
  AttendeesEvent,
  DetailedEvent,
  MinimalEvent,
} from '@/models/api/google/Google';
import {
  DetailedEventConverter,
  MinimalEventConverter,
} from '@/converters/api/Google.converter';

export class GooglePrograms {
  private readonly googleRepository: GoogleRepository;
  private readonly minimalEventConverter: MinimalEventConverter;
  private readonly detailEventConverter: DetailedEventConverter;

  constructor(googleRepository: GoogleRepository) {
    this.googleRepository = googleRepository;
    this.minimalEventConverter = new MinimalEventConverter();
    this.detailEventConverter = new DetailedEventConverter();
  }
  public async events(): Promise<MinimalEvent[]> {
    const BusinessEvents = await this.googleRepository.events();

    const ApiEvents = BusinessEvents.map((event) => {
      try {
        return this.minimalEventConverter.convert(event);
      } catch (error) {
        return null;
      }
    });

    const filteredEvents = ApiEvents.filter(
      (event): event is MinimalEvent => event !== null,
    );

    return filteredEvents;
  }

  public async event(eventId: string): Promise<DetailedEvent | null> {
    try {
      const BusinessEvent = await this.googleRepository.event(eventId);

      return this.detailEventConverter.convert(BusinessEvent);
    } catch (error) {
      return null;
    }
  }

  public async attendees(
    userId: number,
    eventId: string,
  ): Promise<AttendeesEvent | null> {
    const attendees = await this.googleRepository
      .attendees(userId, eventId)
      .catch(() => null);

    return attendees;
  }
}
