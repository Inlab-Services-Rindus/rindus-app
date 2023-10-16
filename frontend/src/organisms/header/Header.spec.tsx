import { Header } from '@/organisms/header/Header';

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

  it('should render a button if logged in', () => {
    isLoggedInSpy = true;

    render(<Header />);

    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('should render single button if not logged in', () => {
    isLoggedInSpy = false;

    render(<Header />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should call navigate when Mag button is clicked', async () => {
    isLoggedInSpy = true;

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

  it('should call navigate when button is clicked', async () => {
    isLoggedInSpy = true;
    render(<Header />);

    screen.getAllByRole('button')[2].click();

    await waitFor(() =>
      expect(useNavigateSpy).toHaveBeenCalledWith('/profile'),
    );
  });
});
