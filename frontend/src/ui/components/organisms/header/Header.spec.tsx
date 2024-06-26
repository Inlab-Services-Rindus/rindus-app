import Header from '@/ui/components/organisms/header/Header';
import { render, screen } from '@testing-library/react';

let isLoggedInSpy = true;

const useSetSearchData = vi.fn();
const useSetQueryKey = vi.fn();
const useSetCurrentTab = vi.fn();

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({
      isLoggedIn: isLoggedInSpy,
      userProfileData: { id: 1 },
      setSearchData: useSetSearchData,
      setQueryKey: useSetQueryKey,
      setCurrentTab: useSetCurrentTab,
    }),
  };
});

const useNavigateSpy = vi.fn();
let pathnameSpy = '/';
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
    useLocation: vi.fn(() => ({ pathname: pathnameSpy })),
  };
});

describe('Header', () => {
  beforeEach(() => {
    useNavigateSpy.mockClear();
    isLoggedInSpy = true;
  });

  describe('not logged', () => {
    it('should render header login when the user is not logged', () => {
      isLoggedInSpy = false;

      render(<Header />);

      expect(screen.getByTestId('header-login')).toBeInTheDocument();
      expect(screen.getByTestId('rindusLogo')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('should not call navigate when Logo button is clicked', () => {
      isLoggedInSpy = false;

      render(<Header />);

      screen.getByTestId('rindusLogo').click();

      expect(useNavigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('logged', () => {
    describe('not on profile page', () => {
      it('should render header logged when the user is logged', () => {
        render(<Header />);

        expect(screen.getByTestId('header-logged')).toBeInTheDocument();
        expect(screen.getByTestId('rindusLogo')).toBeInTheDocument();
        expect(screen.getByTestId('search')).toBeInTheDocument();
        expect(screen.getByTestId('profile')).toBeInTheDocument();
      });

      it('should call navigate and setSearch when Search button is clicked', () => {
        render(<Header />);

        screen.getByTestId('search').click();

        expect(useNavigateSpy).toHaveBeenCalledWith('/search');
        expect(useSetSearchData).toHaveBeenCalledWith({
          tags: [],
          users: [],
          results: [],
          search: { display: '', query: '' },
        });
      });

      it('should call navigate and setCurrentTab when Logo button is clicked', () => {
        render(<Header />);

        screen.getByTestId('rindusLogo').click();

        expect(useNavigateSpy).toHaveBeenCalledWith('/');
        expect(useSetCurrentTab).toHaveBeenCalledWith(0);
      });

      it('should call navigate when Profile button is clicked', () => {
        render(<Header />);

        screen.getByTestId('profile').click();

        expect(useNavigateSpy).toHaveBeenCalledWith('/profile/1');
      });
    });

    describe('on profile page', () => {
      it('should render header logged when the user is logged', () => {
        pathnameSpy = '/profile/1';
        render(<Header />);

        expect(screen.getByTestId('header-logged')).toBeInTheDocument();
        expect(screen.getByTestId('back')).toBeInTheDocument();
        expect(screen.getByTestId('logout')).toBeInTheDocument();
      });
    });
  });
});
