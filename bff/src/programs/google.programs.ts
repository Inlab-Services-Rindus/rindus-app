import { GoogleRepository } from '@/models/service/google/google.repository';
import { Event } from '@/models/api/google/Google';
import { EventConverter } from '@/converters/api/Google.converter';

export class GooglePrograms {
  private readonly googleRepository: GoogleRepository;
  private readonly eventConverter: EventConverter;

  constructor(googleRepository: GoogleRepository) {
    this.googleRepository = googleRepository;
    this.eventConverter = new EventConverter();
  }
  public async events(): Promise<Event[]> {
    const BusinessEvents = await this.googleRepository.events();

    const ApiEvents = BusinessEvents.map((event) => {
      return this.eventConverter.convert(event);
    });

    return ApiEvents;
  }
}
