import { Request, Response } from 'express';
import { SearchController } from '@/http/controllers/search.controller';
import { SearchPrograms } from '@/programs/search.programs';
import { SuggestionsResultConverter } from '@/converters/api/Search.converter';
import { SearchService } from '@/services/search';
import { UserRepository } from '@/repository/user.repository';
import * as RecordConverterhelper from '@/helpers/RecordConverterHelper';
import {
  convertedSuggestionsByLanguageResponseMock,
  suggestionsByLanguageResponseMock,
  suggestionsMock,
} from '@/mocks/searchMocks';
import { sanitise } from '@/helpers/RecordConverterHelper';

jest.mock('@/converters/api/Search.converter', () => ({
  SuggestionsResultConverter: jest.fn().mockImplementation(() => ({
    convert: jest.fn(),
  })),
}));

describe('SearchController', () => {
  let searchService: SearchService;
  let userRepository: UserRepository;
  let searchController: SearchController;
  let searchPrograms: SearchPrograms;
  let suggestionsResultConverter: SuggestionsResultConverter;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    searchPrograms = new SearchPrograms(searchService, userRepository);
    suggestionsResultConverter = new SuggestionsResultConverter();
    searchController = new SearchController(searchPrograms);
    request = {} as Request;
    response = {
      send: jest.fn(),
      sendStatus: jest.fn(),
    } as unknown as Response;
  });

  describe('suggestions', () => {
    it('should send suggestions if query param is present', async () => {
      const query = 'example query';
      request.query = { query };

      jest
        .spyOn(searchPrograms, 'suggestions')
        .mockResolvedValue(suggestionsMock);

      const expectedConvertedSuggestions =
        suggestionsResultConverter.convert(suggestionsMock);

      await searchController.suggestions(request, response);

      expect(searchPrograms.suggestions).toHaveBeenCalledWith(query);
      expect(suggestionsResultConverter.convert).toHaveBeenCalledWith(
        suggestionsMock,
      );
      expect(response.send).toHaveBeenCalledWith(expectedConvertedSuggestions);
    });

    it('should send an empty array if query param is not present', async () => {
      request.query = {};
      jest.spyOn(searchPrograms, 'suggestions');

      await searchController.suggestions(request, response);

      expect(searchPrograms.suggestions).not.toHaveBeenCalled();
      expect(response.send).toHaveBeenCalledWith([]);
    });

    describe('search', () => {
      [
        {
          request: {
            query: { keyword: '', query: '' },
          } as unknown as Request,
          testCondition: 'query is empty',
        },
        {
          request: {
            query: { keyword: 'language', query: '', id: '' },
          } as unknown as Request,
          testCondition: 'keyword is "language" but id is not present',
        },
        {
          request: {
            query: { keyword: 'position', query: '', id: 'exampleId' },
          } as unknown as Request,
          testCondition: 'keyword is "position" but query is not present',
        },
      ].forEach(({ request, testCondition }) => {
        it(`should send 400 status if ${testCondition}`, async () => {
          await searchController.search(request, response);

          expect(response.sendStatus).toHaveBeenCalledWith(400);
        });
      });

      it('should send search results by language if keyword is "language" and id is present', async () => {
        const keyword = 'language';
        const id = '123';
        request.query = { keyword, id };

        jest
          .spyOn(searchPrograms, 'searchByLanguage')
          .mockResolvedValue(suggestionsByLanguageResponseMock);

        await searchController.search(request, response);
        //TODO: Find a way of testing that the response passes through userResultConverter.convert

        expect(searchPrograms.searchByLanguage).toHaveBeenCalledWith(
          Number(id),
        );
        expect(response.send).toHaveBeenCalledWith(
          convertedSuggestionsByLanguageResponseMock,
        );
      });

      it('should send search results by position if keyword is "position" and query is present', async () => {
        const sanitiseSpy = jest.spyOn(RecordConverterhelper, 'sanitise');
        const keyword = 'position';
        const query = 'exampleQuery';
        const sanitizedQuery = sanitise(query);
        request.query = { keyword, query };

        jest
          .spyOn(searchPrograms, 'searchByPosition')
          .mockResolvedValue(suggestionsByLanguageResponseMock);

        await searchController.search(request, response);

        //TODO: Find a way of testing that the response passes through userResultConverter.convert

        expect(sanitiseSpy).toHaveBeenCalledWith(query);
        expect(searchPrograms.searchByPosition).toHaveBeenCalledWith(
          sanitizedQuery,
        );
        expect(response.send).toHaveBeenCalledWith(
          convertedSuggestionsByLanguageResponseMock,
        );
      });

      it('should send an empty array if query is not present', async () => {
        searchPrograms.search = jest.fn();
        request.query = { keyword: 'exampleKeyword', query: '' };

        await searchController.search(request, response);

        expect(searchPrograms.search).not.toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith([]);
      });
    });
  });
});
