import { config } from '@/config/config';
import * as useFetch from '@/hooks/fetch/useFetch';
import { mockUsersResponse } from '@/model/__mocks__/fetch/Employee';
import { mockPartnersResponse } from '@/model/__mocks__/fetch/Partner';
import { Home } from '@/pages/home/Home';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const useNavigateSpy = vi.fn();
const useLocationSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
    useLocation: () => useLocationSpy,
  };
});

const showToastErrorSpy = vi.fn();

vi.mock('@/hooks/toast/useToast', async () => {
  const actual = (await vi.importActual('@/hooks/toast/useToast')) as any;
  return {
    ...actual,
    default: () => ({
      showToastError: showToastErrorSpy,
    }),
  };
});

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({ isLoggedIn: true }),
  };
});

describe('Home', () => {
  const useFetchSpy = vi.spyOn(useFetch, 'default');

  it('should fetch the data when render the component', async () => {
    useFetchSpy.mockReturnValueOnce({
      data: mockUsersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });
    useFetchSpy.mockReturnValueOnce({
      data: mockPartnersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    expect(useFetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${config.backendUrl}/users`,
        options: { credentials: 'include' },
        onErrorCallback: expect.any(Function),
      }),
    );
  });

  it('should show loader when isLoading the fetch', () => {
    useFetchSpy.mockReturnValueOnce({
      data: [],
      isLoading: true,
      refresh: vi.fn(),
    });
    useFetchSpy.mockReturnValueOnce({
      data: mockPartnersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render the RefreshButton when fetch response is empty', () => {
    useFetchSpy.mockReturnValueOnce({
      data: null,
      isLoading: false,
      refresh: vi.fn(),
    });
    useFetchSpy.mockReturnValueOnce({
      data: mockPartnersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
  });

  it('should render the PeopleTab when fetch response is not empty', () => {
    useFetchSpy.mockReturnValueOnce({
      data: mockUsersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });
    useFetchSpy.mockReturnValueOnce({
      data: [],
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByTestId('people-tab')).toBeInTheDocument();
  });

  it('should show toast error when the fetch call to onErrorCallback', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce(mockUsersResponse),
    });
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce(mockPartnersResponse),
    });

    render(<Home />);

    await waitFor(() => {
      expect(showToastErrorSpy).toHaveBeenCalled();
    });
  });

  it('should call to refresh when clicks on the RefreshButton', () => {
    const refreshSpy = vi.fn();

    useFetchSpy.mockReturnValueOnce({
      data: null,
      isLoading: false,
      refresh: refreshSpy,
    });
    useFetchSpy.mockReturnValueOnce({
      data: null,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    fireEvent.click(screen.getByTestId('refresh-button'));

    expect(refreshSpy).toHaveBeenCalled();
  });
});
