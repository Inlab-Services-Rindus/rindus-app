import * as toastMock from 'react-toastify';

import { config } from '@/config/config';
import * as useFetch from '@/hooks/fetch/useFetch';
import { Home } from '@/pages/home/Home';

import mockUsersResponse from '@mocks/responses/users/users.json';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const useNavigateSpy = vi.fn();
const useLocationSpy = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => useNavigateSpy,
  useLocation: () => useLocationSpy,
}));

describe('Home', async () => {
  const useFetchSpy = vi.spyOn(useFetch, 'default');

  it('should render the RefreshButton when fetch response is empty', () => {
    useFetchSpy.mockReturnValueOnce({
      data: null,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
  });

  it('should render the PeopleTab when fetch response is not empty', () => {
    useFetchSpy.mockReturnValueOnce({
      data: mockUsersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('people-tab')).toBeInTheDocument();
  });

  it('should fetch the data when render the component', async () => {
    useFetchSpy.mockReturnValueOnce({
      data: mockUsersResponse,
      isLoading: false,
      refresh: vi.fn(),
    });

    render(<Home />);

    await waitFor(() => {
      expect(useFetchSpy).toHaveBeenCalledWith({
        url: `${config.backendUrl}/users`,
        options: {},
        onUnauthorizedCallback: expect.any(Function),
        onErrorCallback: expect.any(Function),
      });
    });
  });

  it('should show toast error when the fetch call to onErrorCallback', async () => {
    const errorSpy = vi.spyOn(toastMock.toast, 'error');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce(mockUsersResponse),
    });

    render(<Home />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('should navigate to login showing an toast info when the fetch call to onUnauthorizedCallback', async () => {
    const infoSpy = vi.spyOn(toastMock.toast, 'info');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValueOnce(mockUsersResponse),
    });

    render(<Home />);

    await waitFor(() => {
      expect(useNavigateSpy).toHaveBeenCalledWith('/login');
      expect(infoSpy).toHaveBeenCalled();
    });
  });

  it('should call to refresh when clicks on the RefreshButton', async () => {
    const refreshSpy = vi.fn();

    useFetchSpy.mockReturnValueOnce({
      data: null,
      isLoading: false,
      refresh: refreshSpy,
    });

    render(<Home />);

    fireEvent.click(screen.getByTestId('refresh-button'));

    expect(refreshSpy).toHaveBeenCalled();
  });
});
