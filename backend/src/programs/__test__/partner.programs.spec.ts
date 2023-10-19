import { PartnerPrograms } from '@/programs/partner.programs';
import { MockPartnerRepository, mockAll } from '@/repository/__mocks__/partner';

describe('PartnerPrograms', () => {
  let partnerPrograms: PartnerPrograms;

  beforeAll(() => {
    const partnerRepository = new MockPartnerRepository();
    partnerPrograms = new PartnerPrograms(partnerRepository);
  });

  describe('index', () => {
    it('should call PartnerRepository', async () => {
      await partnerPrograms.index();

      expect(mockAll).toBeCalledTimes(1);
    });
  });
});
