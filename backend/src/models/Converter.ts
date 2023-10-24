export interface Converter<T, S> {
  convert: (_source: T) => S;
}
