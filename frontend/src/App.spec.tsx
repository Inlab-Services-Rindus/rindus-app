import App from '@/App';

import { screen, render } from '@testing-library/react';

vi.mock('@/pages/login/Login', () => ({
  Login: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('@/context/auth/Auth', async () => {
  const actual = (await vi.importActual('@/context/auth/Auth')) as JSX.Element;
  return {
    ...actual,
    AuthProvider: ({ children }: { children: JSX.Element }) => (
      <div>{children}</div>
    ),
  };
});

describe('App', () => {
  it('should render Router with default page', () => {
    render(<App />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render Toast', () => {
    const { container } = render(<App />);

    expect(container.querySelector('#toast-container')).toBeInTheDocument();
  });

  it('should render Header', () => {
    render(<App />);

    expect(screen.getByTestId('header-login')).toBeInTheDocument();
  });
});
