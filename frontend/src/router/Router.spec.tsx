import { MemoryRouter } from 'react-router-dom';

import { AuthContext } from '@/context/auth/Auth';
import { Router } from '@/router/Router';

import { render, screen } from '@testing-library/react';

vi.mock('@/pages/home/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('@/pages/login/Login', () => ({
  Login: () => <div data-testid="login-page" />,
}));

describe('Router Component', () => {
  it('should render loader when the router is loading', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          isLoading: true,
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter initialEntries={['/']}>
          <Router />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  describe('Home Page', () => {
    it('should render home page when the path is / and is authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should not render home page when the path is / and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });
  });

  describe('Login Page', () => {
    it('should render login page when the path is /login and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/login']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    it('should render home page when the path is /login and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/login']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
});
