import { SearchService } from '@/services/search';
import { SearchPrograms } from './search.programs';
import { UserRepository } from '@/repository/user.repository';
import { Language } from '@/models/business/Language';
import { userWithInfoAndLanguagesMock } from '@/mocks/userMocks';
import { config } from '@/config';
import { userRepositoryMock } from '@/mocks/userRepositoryMock';
import { searchServiceMock } from '@/mocks/searchServiceMock';

describe('SearchPrograms', () => {
  let searchPrograms: SearchPrograms;
  let searchService: SearchService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = userRepositoryMock;
    searchService = searchServiceMock;
    searchPrograms = new SearchPrograms(searchService, userRepository);
  });

  describe('suggestions', () => {
    it('should return suggestions for languages, positions, and users', async () => {
      const query = 'typescript';
      const expectedSuggestions = {
        languages: [
          {
            display: 'TypeScript',
            query: `${config.app.url}/search?keyword=language&id=1`,
          },
        ],
        positions: [
          {
            display: 'Backend Developer',
            query: `${config.app.url}/search?keyword=position&query=Backend%20Developer`,
          },
        ],
        users: [userWithInfoAndLanguagesMock],
      };

      jest
        .spyOn(searchService, 'suggestLanguages')
        .mockResolvedValue([{ id: 1, name: 'TypeScript' }] as Language[]);
      jest
        .spyOn(searchService, 'suggestPositions')
        .mockResolvedValue(['Backend Developer']);
      jest
        .spyOn(searchService, 'suggestUsers')
        .mockResolvedValue([userWithInfoAndLanguagesMock]);

      const suggestions = await searchPrograms.suggestions(query);

      expect(searchService.suggestLanguages).toHaveBeenCalledWith(query);
      expect(searchService.suggestPositions).toHaveBeenCalledWith(query);
      expect(searchService.suggestUsers).toHaveBeenCalledWith(query);
      expect(suggestions).toEqual(expectedSuggestions);
    });
  });

  describe('searchByLanguage', () => {
    it('should return users by language', async () => {
      const languageId = 1;
      const usersMock = [userWithInfoAndLanguagesMock];
      jest.spyOn(userRepository, 'allByLanguage').mockResolvedValue(usersMock);

      const users = await searchPrograms.searchByLanguage(languageId);

      expect(userRepository.allByLanguage).toHaveBeenCalledWith(languageId);
      expect(users).toEqual(usersMock);
    });
  });

  describe('searchByPosition', () => {
    it('should return users by position', async () => {
      const positionQuery = 'backend developer';
      const usersMock = [userWithInfoAndLanguagesMock];
      jest
        .spyOn(searchService, 'searchUsersByPosition')
        .mockResolvedValue(usersMock);

      const users = await searchPrograms.searchByPosition(positionQuery);

      expect(searchService.searchUsersByPosition).toHaveBeenCalledWith(
        positionQuery,
      );

      expect(users).toEqual(usersMock);
    });
  });

  describe('search', () => {
    it('should return users by search query', async () => {
      const query = 'John Doe';
      const usersMock = [userWithInfoAndLanguagesMock];
      jest.spyOn(searchService, 'searchUsers').mockResolvedValue(usersMock);

      const users = await searchPrograms.search(query);

      expect(searchService.searchUsers).toHaveBeenCalledWith(query);
      expect(users).toEqual(usersMock);
    });
  });
});
