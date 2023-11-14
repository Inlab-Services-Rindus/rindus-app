import { GoogleButtonProps } from '@/ui/components/atoms/buttons/google/GoogleButton';
import { Login } from '@/ui/section/login/Login';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@/ui/components/atoms/buttons/google/GoogleButton', () => ({
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

const loginSpy = vi.fn();
vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({ login: loginSpy }),
  };
});

describe('Login', () => {
  it('should render successfully', () => {
    render(<Login />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('google-mock')).toBeInTheDocument();
  });

  it('should call fetch when button is clicked', () => {
    render(<Login />);

    fireEvent.click(screen.getByTestId('google-mock'));

    expect(loginSpy).toHaveBeenCalled();
  });
});
