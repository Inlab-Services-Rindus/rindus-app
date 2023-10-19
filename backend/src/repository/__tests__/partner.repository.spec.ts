import { connectTestDatabase } from '@/bootstrap/database';
import { PartnerRecord } from '@/models/service/PartnerRecord';
import { KnexPartnerRepository } from '@/repository/knex/partner.repository';

describe('KnexPartnerRepository', () => {
  let partnerRepository: KnexPartnerRepository;
  const allPartnerRecords = [
    {
      id: 1,
      name: 'Partner1',
      picture_url: 'picture1',
    },
    {
      id: 2,
      name: 'Partner2',
      picture_url: 'picture2',
    },
  ];

  beforeAll(async () => {
    const knex = connectTestDatabase();
    await knex<PartnerRecord>('partners').insert(allPartnerRecords);

    partnerRepository = new KnexPartnerRepository(knex);
  });

  describe('all', () => {
    it('should return all partners', async () => {
      const partners = await partnerRepository.all();

      expect(partners).toHaveLength(2);
    });

    it('should return empty array if no partners', async () => {
      await connectTestDatabase()('partners').truncate();

      const partners = await partnerRepository.all();

      expect(partners).toEqual([]);
    });
  });
});
