import { Enumerable, Identifiable } from '@/models/service/database/Record';

export interface OfficeRecord extends Identifiable, Enumerable {}

export interface WithOfficeRecord {
  office_name: string;
}
