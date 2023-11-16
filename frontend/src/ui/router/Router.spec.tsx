import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { Router } from '@/ui/router/Router';

import { AuthContext } from '@/ui/context/auth/Auth';

vi.mock('@/ui/section/home/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('@/ui/section/login/Login', () => ({
  Login: () => <div data-testid="login-page" />,
}));

vi.mock('@/ui/section/search/Search', () => ({
  Search: () => <div data-testid="search-page">Search Page</div>,
}));

vi.mock('@/ui/section/profile/Profile', () => ({
  Profile: () => <div data-testid="profile-page">Profile Page</div>,
}));

vi.mock('@/ui/section/partner/Partner', () => ({
  PartnerInfo: () => <div data-testid="partner-page">Partner Page</div>,
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

    it('should render home page when the path is not defined and is authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/test']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.queryByTestId('home-page')).toBeInTheDocument();
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
    it('should render login page when the path is defined and is not authenticated', () => {
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
      expect(screen.queryByTestId('login-page')).toBeInTheDocument();
    });
    it('should render login page when the path is not defined and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/test']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.queryByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Search Page', () => {
    it('should render search page when the path is /search and is authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/search']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.getByTestId('search-page')).toBeInTheDocument();
    });

    it('should not render search page when the path is /search and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/search']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.queryByTestId('serarch-page')).not.toBeInTheDocument();
    });
  });

  describe('Profile Page', () => {
    it('should render search page when the path is /profile/:id and is authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/profile/1']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('should not render profile page when the path is /profile/:id and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/profile/1']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
    });
  });

  describe('Partner Page', () => {
    it('should render search page when the path is /partner/:id and is authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/partner/1']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.getByTestId('partner-page')).toBeInTheDocument();
    });

    it('should not render partner page when the path is /partner/:id and is not authenticated', () => {
      render(
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/partner/1']}>
            <Router />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.queryByTestId('partner-page')).not.toBeInTheDocument();
    });
  });
});
