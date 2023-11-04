import { Partner } from '@/models/business/Partner';
import { PartnerRepository } from '@/repository/partner.repository';

export const mockAll = jest.fn().mockReturnValue([]);

export class MockPartnerRepository implements PartnerRepository {
  all: () => Promise<Partner[]> = mockAll;
}
