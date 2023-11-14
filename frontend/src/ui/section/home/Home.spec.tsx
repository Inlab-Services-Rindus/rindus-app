import { config } from '@/config/config';
import { Home } from '@/ui/section/home/Home';

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

describe.skip('Home', () => {
  beforeEach(() => {
    showToastErrorSpy.mockReset();
  });

  // it('should fetch the data when render the component', async () => {
  //   useFetchSpy.mockReturnValueOnce({
  //     data: mockUsersResponse,
  //     isLoading: false,
  //     refresh: vi.fn(),
  //   });
  //   useFetchSpy.mockReturnValueOnce({
  //     data: mockPartnersResponse,
  //     isLoading: false,
  //     refresh: vi.fn(),
  //   });

  //   render(<Home />);

  //   expect(useFetchSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       url: `${config.backendUrl}/users`,
  //       options: { credentials: 'include' },
  //       onErrorCallback: expect.any(Function),
  //     }),
  //   );

  //   expect(useFetchSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       url: `${config.backendUrl}/partners`,
  //       options: { credentials: 'include' },
  //       onErrorCallback: expect.any(Function),
  //     }),
  //   );
  // });

  // it('should render the PeopleTab when fetch response is not empty', () => {
  //   useFetchSpy.mockReturnValueOnce({
  //     data: mockUsersResponse,
  //     isLoading: false,
  //     refresh: vi.fn(),
  //   });
  //   useFetchSpy.mockReturnValueOnce({
  //     data: [],
  //     isLoading: false,
  //     refresh: vi.fn(),
  //   });

  //   render(<Home />);

  //   expect(screen.getByTestId('people-tab')).toBeInTheDocument();
  // });

  // it('should show toast error when the fetch call to onErrorCallback', async () => {
  //   global.fetch = vi.fn().mockResolvedValueOnce({
  //     ok: false,
  //     json: vi.fn().mockResolvedValueOnce(mockUsersResponse),
  //   });
  //   global.fetch = vi.fn().mockResolvedValueOnce({
  //     ok: false,
  //     json: vi.fn().mockResolvedValueOnce(mockPartnersResponse),
  //   });

  //   render(<Home />);

  //   await waitFor(() => {
  //     expect(showToastErrorSpy).toHaveBeenCalled();
  //   });
  // });

  // it('should render the PartnersTab when fetch response is not empty', () => {
  //   useFetchSpy.mockReturnValueOnce({
  //     data: [],
  //     isLoading: false,
  //     refresh: vi.fn(),
  //   });
  //   useFetchSpy.mockReturnValueOnce({
  //     data: mockPartnersResponse,
  //     isLoading: false,
  //     refresh: vi.fn(),
  //   });

  //   render(<Home />);

  //   fireEvent.click(screen.getByText('Partners'));

  //   expect(screen.getByTestId('partners-tab')).toBeInTheDocument();
  // });
});
