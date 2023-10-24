import { Enumerable } from '@/models/service/Record';

export type Insertable<T> = Omit<T, 'id'>;

export const fromRecordId = (id: number): string => id.toFixed();

export function distinctRecords(items: string[]): Enumerable[] {
  return distinct(items).map(toRecord);
}

export function isEmpty(string: string): boolean {
  return string.trim().length === 0;
}

function distinct<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function toRecord(elem: string): Enumerable {
  return { name: elem };
}
