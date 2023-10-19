import { Header } from '@/components/organisms/header/Header';

import { render, screen } from '@testing-library/react';

let isLoggedInSpy = true;

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({ isLoggedIn: isLoggedInSpy }),
    createContext: vi.fn(),
  };
});

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
      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('should not call navigate when Logo button is clicked', () => {
      isLoggedInSpy = false;

      render(<Header />);

      screen.getByTestId('logo').click();

      expect(useNavigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('logged', () => {
    it('should render header logged when the user is logged', () => {
      render(<Header />);

      expect(screen.getByTestId('header-logged')).toBeInTheDocument();
      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('mag')).toBeInTheDocument();
      expect(screen.getByTestId('profile')).toBeInTheDocument();
    });

    it('should call navigate when Mag button is clicked', () => {
      render(<Header />);

      screen.getByTestId('mag').click();

      expect(useNavigateSpy).toHaveBeenCalledWith('/search');
    });

    it('should call navigate when Logo button is clicked', () => {
      render(<Header />);

      screen.getByTestId('logo').click();

      expect(useNavigateSpy).toHaveBeenCalledWith('/');
    });

    it('should call navigate when Profile button is clicked', () => {
      render(<Header />);

      screen.getByTestId('profile').click();

      expect(useNavigateSpy).toHaveBeenCalledWith('/profile');
    });
  });
});
