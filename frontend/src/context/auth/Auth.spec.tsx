import { config } from '@/config/config';
import { AuthContext, AuthProvider } from '@/context/auth/Auth';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const showToastErrorSpy = vi.fn();
const showToastSuccessSpy = vi.fn();
vi.mock('@/hooks/toast/useToast', async () => {
  const actual = (await vi.importActual('@/hooks/toast/useToast')) as any;
  return {
    ...actual,
    default: () => ({
      showToastError: showToastErrorSpy,
      showToastSuccess: showToastSuccessSpy,
    }),
  };
});

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

// First call to fetch is for soft login
// Second call to fetch is for login/logout global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, }).mockResolvedValueOnce({ ok: true, json: async () => ({}), });

describe('Auth', () => {
  beforeEach(() => {
    useNavigateSpy.mockReset();
    showToastErrorSpy.mockReset();
    showToastSuccessSpy.mockReset();
  });

  it('should render succesfully', () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    render(
      <AuthProvider>
        <div data-testid="auth-provider">AuthProvider</div>
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('auth is false and loading is true by default', () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <div>
              <span>Is logged in: {value.isLoggedIn.toString()}</span>
              <span>Is loading: {value.isLoading.toString()}</span>
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(getByText('Is logged in: false')).toBeTruthy();
    expect(getByText('Is loading: true')).toBeTruthy();
  });

  describe.skip('Soft Login', () => {
    it('should set authed to true and navigate to home when the soft login call is ok', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button
                  onClick={() =>
                    value.login({ credential: 'jwt-test', select_by: 'test' })
                  }
                >
                  Login
                </button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/soft-login`,
        expect.objectContaining({
          credentials: 'include',
        }),
      );

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });
    });

    it('should show toast error when the response from soft login call is not ok and the code is different from 400', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button
                  onClick={() =>
                    value.login({ credential: 'jwt-test', select_by: 'test' })
                  }
                >
                  Login
                </button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/soft-login`,
        expect.objectContaining({
          credentials: 'include',
        }),
      );

      await waitFor(() => {
        expect(showToastErrorSpy).toHaveBeenCalledWith('Login expired');

        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });

    it('should not show toast error when the response from soft login call is not ok and the code is 400 ', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
      });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button
                  onClick={() =>
                    value.login({ credential: 'jwt-test', select_by: 'test' })
                  }
                >
                  Login
                </button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/soft-login`,
        expect.objectContaining({
          credentials: 'include',
        }),
      );

      await waitFor(() => {
        expect(showToastErrorSpy).not.toHaveBeenCalled();

        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });
  });

  describe('Login', () => {
    it('should set authed to true and navigate to home when the response from login call is ok', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button
                  onClick={() =>
                    value.login({ credential: 'jwt-test', select_by: 'test' })
                  }
                >
                  Login
                </button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Login'));

      expect(global.fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/login`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt: 'jwt-test' }),
          method: 'POST',
        }),
      );

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });
    });

    it('should maintain authed and show toast error when the response from login call is not ok', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: false,
        });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button
                  onClick={() =>
                    value.login({ credential: 'jwt-test', select_by: 'test' })
                  }
                >
                  Login
                </button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Login'));

      expect(global.fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/login`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt: 'jwt-test' }),
          method: 'POST',
        }),
      );

      await waitFor(() => {
        expect(showToastErrorSpy).toHaveBeenCalledWith('Login failed');

        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });
  });

  describe('Logout', () => {
    it('should set authed to false and navigate to login and show success toast when the response from logout call is ok', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button onClick={value.logout}>Logout</button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Logout'));

      expect(global.fetch).toHaveBeenCalledWith(`${config.backendUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      await waitFor(() => {
        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/login');
        expect(showToastSuccessSpy).toHaveBeenCalledWith('Logout successful');
      });
    });

    it('should maintain authed and show toast error when the response from logout call is not ok', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: false,
        });
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
                <button onClick={value.logout}>Logout</button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Logout'));

      expect(global.fetch).toHaveBeenCalledWith(`${config.backendUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(showToastErrorSpy).toHaveBeenCalledWith('Logout unsuccessful');
      });
    });
  });
});
