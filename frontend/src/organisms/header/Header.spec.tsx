import { Header } from '@/organisms/header/Header';

// import { AuthContext } from '@/context/auth/Auth';
import { render, screen, waitFor } from '@testing-library/react';

let isLoggedInSpy = false;
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useContext: () => ({ isLoggedIn: isLoggedInSpy }),
  createContext: vi.fn(),
}));

const useNavigateSpy = vi.fn();
const useLocationSpy = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => useNavigateSpy,
  useLocation: () => useLocationSpy,
}));

describe('Header', () => {
  beforeEach(() => {
    useNavigateSpy.mockClear();
  });

  it('should render Header component', () => {
    render(<Header />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render logo', () => {
    render(<Header />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('should render a button', () => {
    render(<Header />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('should call navigate when Mag button is clicked', async () => {
    render(<Header />);

    screen.getAllByRole('button')[0].click();

    await waitFor(() => expect(useNavigateSpy).toHaveBeenCalledWith('/search'));
  });

  it('should call navigate when Logo button is clicked and isLoggedIn', async () => {
    isLoggedInSpy = true;
    render(<Header />);

    screen.getAllByRole('button')[1].click();

    await waitFor(() => {
      expect(useNavigateSpy).toHaveBeenCalledWith('/');
    });
  });
});
