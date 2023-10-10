import { GoogleButtonProps } from '@/atoms/buttons/google/GoogleButton';
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
  });

  it('should render a button', () => {
    render(<Login />);

    expect(screen.getByRole('button')).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole('button'));

    expect(loginSpy).toHaveBeenCalled();
  });
});
