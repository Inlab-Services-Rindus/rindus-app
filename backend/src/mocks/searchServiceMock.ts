import { SearchService } from '@/services/search';

export const searchServiceMock: jest.Mocked<SearchService> = {
  searchUsers: jest.fn(),
  suggestUsers: jest.fn(),
  suggestPositions: jest.fn(),
  suggestLanguages: jest.fn(),
  searchUsersByPosition: jest.fn(),
};
