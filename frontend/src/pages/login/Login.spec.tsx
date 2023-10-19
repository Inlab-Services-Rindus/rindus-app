import { GoogleButtonProps } from '@/components/atoms/buttons/google/GoogleButton';
import { AuthContext } from '@/context/auth/Auth';
import { Login } from '@/pages/login/Login';

import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@/atoms/buttons/google/GoogleButton', () => ({
  default: (props: GoogleButtonProps) => (
    <button
      data-testid="google-mock"
      onClick={() =>
        props.afterLogin({ credential: 'jwt-test', select_by: 'test' })
      }
    />
  ),
}));

const useNavigateSpy = vi.fn();
const useLocationSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
    useLocation: () => useLocationSpy,
  };
});

interface GoogleAPI {
  accounts: {
    id: {
      initialize: () => void;
      prompt: () => void;
    };
  };
}

(global as any).google = {
  accounts: {
    id: {
      initialize: vi.fn(),
      prompt: vi.fn(),
    },
  },
} as GoogleAPI;

describe('Login', () => {
  it('should render successfully', () => {
    render(<Login />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('header-login')).toBeInTheDocument();
    expect(screen.getByTestId('google-mock')).toBeInTheDocument();
  });

  it('should call fetch when button is clicked', () => {
    const loginSpy = vi.fn();
    render(
      <AuthContext.Provider
        value={{ isLoggedIn: false, login: loginSpy, logout: vi.fn() }}
      >
        <Login />
      </AuthContext.Provider>,
    );

    fireEvent.click(screen.getByTestId('google-mock'));

    expect(loginSpy).toHaveBeenCalled();
  });
});
