import { mockUser } from '@/mocks/user';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { AuthContext, AuthProvider } from '@/ui/context/auth/Auth';

const showToastErrorSpy = vi.fn();
const showToastWarningSpy = vi.fn();
const showToastSuccessSpy = vi.fn();
vi.mock('@/ui/hooks/toast/useToast', async () => {
  const actual = (await vi.importActual('@/ui/hooks/toast/useToast')) as any;
  return {
    ...actual,
    default: () => ({
      showToastError: showToastErrorSpy,
      showToastWarning: showToastWarningSpy,
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

const login = vi.fn();
const logout = vi.fn();
const softLogin = vi.fn();
vi.mock('@/modules/auth/infrastructure/AuthRepository', () => ({
  createAuthRepository: vi.fn(() => ({
    login: login,
    logout: logout,
    softLogin: softLogin,
  })),
}));
describe('Auth', () => {
  beforeEach(() => {
    useNavigateSpy.mockReset();
    showToastErrorSpy.mockReset();
    showToastWarningSpy.mockReset();
    showToastSuccessSpy.mockReset();
  });

  it('should render succesfully', async () => {
    render(
      <AuthProvider>
        <div data-testid="auth-provider">AuthProvider</div>
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });
  });

  it('auth is false and loading is true by default', async () => {
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
    await waitFor(() => {
      expect(getByText('Is logged in: false')).toBeTruthy();
      expect(getByText('Is loading: true')).toBeTruthy();
    });
  });

  describe('Soft Login', () => {
    it('should set authed to true and navigate to home when the soft login call is ok', async () => {
      softLogin.mockResolvedValueOnce(mockUser);

      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });
    });

    it('should not show any toast when the response from soft login call throw a "Login expired" error', async () => {
      softLogin.mockImplementationOnce(() => {
        throw new Error('Login expired');
      });

      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => (
              <>
                <span>Is logged in: {value.isLoggedIn.toString()}</span>
                <span>Is loading: {value.isLoading.toString()}</span>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(showToastSuccessSpy).not.toHaveBeenCalled();
        expect(showToastWarningSpy).not.toHaveBeenCalled();
        expect(showToastErrorSpy).not.toHaveBeenCalled();
        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });

    it('should show error toast when the response from soft login call throw a "Error soft logging in" error', async () => {
      softLogin.mockImplementationOnce(() => {
        throw new Error('Error soft logging in');
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

      await waitFor(() => {
        expect(showToastErrorSpy).toHaveBeenCalledWith('Login failed');

        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });
  });

  describe('Login', () => {
    it('should set authed to true and navigate to home when the login call is ok', async () => {
      login.mockResolvedValueOnce(mockUser);

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

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });
    });

    it('should show error toast when the response from soft login call when the user is empty', async () => {
      login.mockResolvedValueOnce(null);

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

      await waitFor(() => {
        expect(showToastErrorSpy).toHaveBeenCalledWith('Login failed');

        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });

    it('should show error toast when the response from soft login call throw an error', async () => {
      softLogin.mockImplementationOnce(() => {
        throw new Error('Error');
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
      await waitFor(() => {
        expect(showToastErrorSpy).toHaveBeenCalledWith('Login failed');
        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
      });
    });
  });

  describe('Logout', () => {
    it('should set authed to false and navigate to login and show success toast when the response from logout call is ok', async () => {
      login.mockResolvedValueOnce(mockUser);
      logout.mockResolvedValueOnce(true);

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
                <button onClick={value.logout}>Logout</button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Login'));

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });

      fireEvent.click(getByText('Logout'));

      await waitFor(() => {
        expect(getByText('Is logged in: false')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/login');
        expect(showToastSuccessSpy).toHaveBeenCalledWith('Logout successful');
      });
    });

    it('should maintain authed and navigate to login and show success toast when the response from logout call is not ok', async () => {
      login.mockResolvedValueOnce(mockUser);
      logout.mockResolvedValueOnce(false);

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
                <button onClick={value.logout}>Logout</button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Login'));

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });

      fireEvent.click(getByText('Logout'));

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(showToastErrorSpy).toHaveBeenCalledWith('Logout unsuccessful');
      });
    });

    it('should maintain authed and show toast error when the response from logout call throw an error', async () => {
      login.mockResolvedValueOnce(mockUser);
      logout.mockImplementationOnce(() => {
        throw new Error('Error');
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
                <button onClick={value.logout}>Logout</button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthProvider>,
      );

      fireEvent.click(getByText('Login'));

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(useNavigateSpy).toHaveBeenCalledWith('/');
      });

      fireEvent.click(getByText('Logout'));

      await waitFor(() => {
        expect(getByText('Is logged in: true')).toBeTruthy();
        expect(getByText('Is loading: false')).toBeTruthy();
        expect(showToastErrorSpy).toHaveBeenCalledWith('Logout unsuccessful');
      });
    });
  });
});
