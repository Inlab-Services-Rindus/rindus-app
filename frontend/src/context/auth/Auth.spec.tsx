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

interface Cookies {
  [key: string]: string;
}

let cookies: Cookies = {};
const setCookie = vi.fn();
const removeCookie = vi.fn();
vi.mock('react-cookie', async () => {
  const actual = (await vi.importActual('react-cookie')) as any;
  return {
    ...actual,
    useCookies: () => [cookies, setCookie, removeCookie],
  };
});

describe('Auth', () => {
  beforeEach(() => {
    useNavigateSpy.mockReset();
    cookies = {};
  });

  it('should render succesfully', () => {
    render(
      <AuthProvider>
        <div data-testid="auth-provider">AuthProvider</div>
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('auth is false by default when the cookie does not exist', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <span>Is logged in: {value.isLoggedIn.toString()}</span>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(getByText('Is logged in: false')).toBeTruthy();
  });

  it('auth is true by default whe the cooke exits', () => {
    cookies = { isLogged: 'true' };

    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <span>Is logged in: {value.isLoggedIn.toString()}</span>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(getByText('Is logged in: true')).toBeTruthy();
  });

  it('should set authed to true, setCookie and navigate to home when the response from login call is ok', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <span>Is logged in: {value.isLoggedIn.toString()}</span>
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
      expect(setCookie).toHaveBeenCalledWith('isLogged', 'true');
      expect(useNavigateSpy).toHaveBeenCalledWith('/');
    });
  });

  it('should mantein authed and show toast error when the response from login call is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <span>Is logged in: {value.isLoggedIn.toString()}</span>
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
    });
  });

  it('should set authed to false, removeCookie and navigate to login and show success toast when the response from logout call is ok', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <span>Is logged in: {value.isLoggedIn.toString()}</span>
              <button onClick={value.logout}>Login</button>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    fireEvent.click(getByText('Login'));

    expect(global.fetch).toHaveBeenCalledWith(`${config.backendUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    await waitFor(() => {
      expect(getByText('Is logged in: false')).toBeTruthy();
      expect(removeCookie).toHaveBeenCalledWith('isLogged');
      expect(useNavigateSpy).toHaveBeenCalledWith('/login');
      expect(showToastSuccessSpy).toHaveBeenCalledWith('Logout successful');
    });
  });

  it('should mantein authed and show toast error when the response from logout call is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <span>Is logged in: {value.isLoggedIn.toString()}</span>
              <button onClick={value.logout}>Login</button>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    fireEvent.click(getByText('Login'));

    expect(global.fetch).toHaveBeenCalledWith(`${config.backendUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    await waitFor(() => {
      expect(getByText('Is logged in: true')).toBeTruthy();
      expect(showToastErrorSpy).toHaveBeenCalledWith('Logout unsuccessful');
    });
  });
});
