import { Enumerable } from '@/models/service/database/Record';

export type Insertable<T> = Omit<T, 'id'>;

export const toRecordId = (id: string): number | undefined => {
  const number = Number(id);

  return isNaN(number) ? undefined : number;
};

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

export function sanitise(string: string) {
  return string
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
