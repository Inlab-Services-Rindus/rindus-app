import ProtectedRoutes from '@/components/organisms/protected-routes/ProtectedRoutes';

import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    Navigate: () => <div data-testid="navigate"></div>,
    Outlet: () => <div data-testid="outlet"></div>,
  };
});

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
