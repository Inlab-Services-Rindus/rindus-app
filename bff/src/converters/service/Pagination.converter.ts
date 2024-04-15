import { Converter } from '@/converters/Converter';
import { Page } from '@/models/business/Pagination';

export class PageConverter<R, T> implements Converter<[R[], number], Page<T>> {
  private readonly recordConverter: Converter<R, T>;

  constructor(dataRecordConverter: Converter<R, T>) {
    this.recordConverter = dataRecordConverter;
  }

  convert(source: [R[], number]): Page<T> {
    const [records, totalPages] = source;

    return {
      data: records.map((record) => this.recordConverter.convert(record)),
      totalPages,
    };
  }
}
