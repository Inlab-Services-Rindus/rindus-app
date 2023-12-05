import { mockSuggestions } from '@/mocks/suggestions';
import { Search } from '@/ui/section/search/Search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mock } from 'node:test';

import { StoreContext, StoreProvider } from '@/ui/context/store/Store';

import { setTagsAndUsers } from '@/ui/helpers/searchHelpers';

const getSuggestion = vi.fn();
const getResults = vi.fn();
vi.mock('@/modules/search/infrastructure/SearchRepository', () => ({
  createSearchRepository: vi.fn(() => ({
    getSuggestion: getSuggestion,
    getResults: getResults,
  })),
}));

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('Search', () => {
  beforeEach(() => {
    getSuggestion.mockReset();
  });

  it('should render search-box by default', () => {
    render(<Search />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('should write text in the search-box', async () => {
    render(
      <StoreProvider>
        <Search />
      </StoreProvider>,
    );

    const searchBox = screen.getByRole('textbox');
    fireEvent.change(searchBox, { target: { value: 'test' } });

    await waitFor(() => {
      expect(expect(searchBox).toHaveValue('TEST'));
    });
  });

  it('should delete text when clicking on X', async () => {
    render(<Search />);

    const searchBox = screen.getByRole('textbox');
    fireEvent.change(searchBox, { target: { value: 'test' } });

    await waitFor(() => {
      screen.getByTestId('close').click();
    });
    expect(searchBox).toHaveValue('');
  });

  it('should fetch suggestions when searching', async () => {
    render(
      <StoreProvider>
        <Search />
      </StoreProvider>,
    );

    const searchBox = screen.getByRole('textbox');
    fireEvent.change(searchBox, { target: { value: 'AN' } });

    await waitFor(() => {
      expect(getSuggestion).toHaveBeenCalledWith('AN');
    });
  });

  it('should render no results found when no suggestions/results', async () => {
    getSuggestion.mockResolvedValueOnce([]);

    render(
      <StoreProvider>
        <Search />
      </StoreProvider>,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'JEJEJEJJ' },
    });

    await waitFor(() => {
      expect(
        screen.getByText('No results found for JEJEJEJJ.'),
      ).toBeInTheDocument();
    });
  });

  it('should render suggestions', async () => {
    getSuggestion.mockResolvedValueOnce(mockSuggestions);

    render(
      <StoreProvider>
        <Search />
      </StoreProvider>,
    );

    const searchBox = screen.getByRole('textbox');
    fireEvent.change(searchBox, { target: { value: 'AN' } });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions')).toBeInTheDocument();
      expect(screen.getByText('SPANISH')).toBeInTheDocument();
      expect(screen.getByText('GERMAN')).toBeInTheDocument();
      expect(screen.getByText('AN')).toBeInTheDocument();
      expect(screen.getByText('BUSINESS ANALYST')).toBeInTheDocument();
      expect(screen.getByText('Alejandro Sanchez Ortiz')).toBeInTheDocument();
    });
  });
});
