import ProtectedRoutes from '@/organisms/protectedRoutes/ProtectedRoutes';

import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  Navigate: () => <div data-testid="navigate"></div>,
  Outlet: () => <div data-testid="outlet"></div>,
}));

describe('ProtectedRoutes', () => {
  it('should render the outlet component when is authenticated', () => {
    render(<ProtectedRoutes isAuth={true} />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should render navigate component when is not authenticated', () => {
    render(<ProtectedRoutes isAuth={false} />);

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });
});
