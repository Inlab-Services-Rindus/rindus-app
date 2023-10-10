import { config } from '@/config/config';
import { AuthContext, AuthProvider } from '@/context/auth/Auth';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const showToastErrorSpy = vi.fn();
const showToastSuccessSpy = vi.fn();
vi.mock('@/hooks/toast/useToast', () => ({
  default: vi.fn(() => ({
    showToastError: showToastErrorSpy,
    showToastSuccess: showToastSuccessSpy,
  })),
}));

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => useNavigateSpy,
}));

describe('Auth', () => {
  beforeEach(() => {
    useNavigateSpy.mockReset();
  });

  it('should render succesfully', () => {
    render(
      <AuthProvider>
        <div data-testid="auth-provider">AuthProvider</div>
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('auth is false by default', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <span>Is logged in: {value.isLoggedIn.toString()}</span>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(getByText('Is logged in: false')).toBeTruthy();
  });

  it('should set authed to true and navigate to home when the response from login call is ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
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

    expect(global.fetch).toHaveBeenCalledWith(`${config.backendUrl}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: 'jwt-test' }),
      method: 'POST',
    });

    await waitFor(() => {
      expect(getByText('Is logged in: true')).toBeTruthy();
      expect(useNavigateSpy).toHaveBeenCalledWith('/');
    });
  });

  it('should mantein authed and show toast error when the response from login call is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
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

    expect(global.fetch).toHaveBeenCalledWith(`${config.backendUrl}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: 'jwt-test' }),
      method: 'POST',
    });

    await waitFor(() => {
      expect(getByText('Is logged in: false')).toBeTruthy();
      expect(showToastErrorSpy).toHaveBeenCalledWith('Login failed');
    });
  });

  it('should set authed to false and navigate to login and show success toast when the response from logout call is ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
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
    });

    await waitFor(() => {
      expect(getByText('Is logged in: false')).toBeTruthy();
      expect(useNavigateSpy).toHaveBeenCalledWith('/login');
      expect(showToastSuccessSpy).toHaveBeenCalledWith('Logout successful');
    });
  });

  it('should mantein authed and show toast error when the response from logout call is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
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
    });

    await waitFor(() => {
      expect(getByText('Is logged in: true')).toBeTruthy();
      expect(showToastErrorSpy).toHaveBeenCalledWith('Logout unsuccessful');
    });
  });
});
