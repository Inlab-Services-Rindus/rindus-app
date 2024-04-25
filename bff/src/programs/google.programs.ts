import { GoogleRepository } from '@/models/service/google/google.repository';
import { DetailedEvent, MinimalEvent } from '@/models/api/google/Google';
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
      return this.minimalEventConverter.convert(event);
    });

    return ApiEvents;
  }

  public async event(eventId: string): Promise<DetailedEvent> {
    const BusinessEvent = await this.googleRepository.event(eventId);

    const ApiEvent = this.detailEventConverter.convert(BusinessEvent);

    return ApiEvent;
  }
}
