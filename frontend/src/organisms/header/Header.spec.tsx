import { Header } from '@/organisms/header/Header';

import { render, screen, waitFor } from '@testing-library/react';

const useNavigateSpy = vi.fn();
const useLocationSpy = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => useNavigateSpy,
  useLocation: () => useLocationSpy,
}));

describe('Header', () => {
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

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should call navigate when button is clicked', async () => {
    render(<Header />);

    screen.getAllByRole('button')[0].click();

    await waitFor(() => expect(useNavigateSpy).toHaveBeenCalledWith('/search'));
  });
});
