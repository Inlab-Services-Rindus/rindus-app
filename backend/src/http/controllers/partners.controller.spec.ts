import {
  PartnerProfileConverter,
  PartnersIndexConverter,
} from '@/converters/api/Partner.converter';
import { Partner } from '@/models/business/Partner';
import { PartnerRepository } from '@/repository/partner.repository';
import { PartnersController } from '@/http/controllers/partners.controller';
import { Request, Response } from 'express';

jest.mock('@/converters/api/Partner.converter', () => ({
  PartnersIndexConverter: jest.fn().mockImplementation(() => ({
    convert: jest.fn(),
  })),
  PartnerProfileConverter: jest.fn().mockImplementation(() => ({
    convert: jest.fn(),
  })),
  PartnerMembersConverter: jest.fn().mockImplementation(() => ({
    convert: jest.fn(),
  })),
}));

describe('PartnersController', () => {
  let partnerRepository: PartnerRepository;
  let partnersController: PartnersController;
  let partnerProfileConverter: PartnerProfileConverter;
  let partnersIndexConverter: PartnersIndexConverter;

  beforeEach(() => {
    partnerRepository = new (jest.fn().mockImplementation(() => ({
      all: jest.fn(),
      findById: jest.fn(),
      members: jest.fn(),
    })))() as unknown as PartnerRepository;
    partnerProfileConverter = new PartnerProfileConverter();
    partnersIndexConverter = new PartnersIndexConverter();
    partnersController = new PartnersController(partnerRepository);
  });

  describe('index', () => {
    it('should return the partners index', async () => {
      const request = {} as unknown as Request;
      const response = {
        send: jest.fn(),
      } as unknown as Response;

      const partners: Partner[] = [
        {
          id: 1,
          name: 'Partner 1',
          logoUrl: 'https://example.com/logo.png',
          description: 'Partner 1 description',
        },
        {
          id: 2,
          name: 'Partner 2',
          logoUrl: 'https://example.com/logo.png',
          description: 'Partner 2 description',
        },
      ];

      jest.spyOn(partnerRepository, 'all').mockResolvedValue(partners);
      const expectedIndex = partnersIndexConverter.convert(partners);

      await partnersController.index(request, response);

      expect(response.send).toHaveBeenCalledWith(expectedIndex);
    });
  });

  describe('show', () => {
    it('should return the partner profile', async () => {
      const request = {
        params: {
          partnerId: '1',
        },
      } as unknown as Request;
      const response = {
        send: jest.fn(),
        sendStatus: jest.fn(),
      } as unknown as Response;

      const partner: Partner = {
        id: 1,
        name: 'Partner 1',
        logoUrl: 'https://example.com/logo.png',
        description: 'Partner 1 description',
      };

      jest.spyOn(partnerRepository, 'findById').mockResolvedValue(partner);
      const expectedProfile = partnerProfileConverter.convert(partner);

      await partnersController.show(request, response);

      expect(response.send).toHaveBeenCalledWith(expectedProfile);
    });

    it('should return 404 if the partner is not found', async () => {
      const request = {
        params: {
          partnerId: '1',
        },
      } as unknown as Request;
      const response = {
        send: jest.fn(),
        sendStatus: jest.fn(),
      } as unknown as Response;

      jest.spyOn(partnerRepository, 'findById').mockResolvedValue(undefined);

      await partnersController.show(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(404);
    });
  });
});
