import { GoogleButtonProps } from '@/ui/components/atoms/buttons/google/GoogleButton';
import { Login } from '@/ui/section/login/Login';
import { Capacitor } from '@capacitor/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('@/ui/components/atoms/buttons/google/GoogleButton', () => ({
  __esModule: true,
  default: (props: GoogleButtonProps) => (
    <button
      data-testid="google-web-mock"
      onClick={() =>
        props.afterLogin({ credential: 'jwt-test', select_by: 'test' })
      }
    />
  ),
}));

vi.mock(
  '@/ui/components/atoms/buttons/nativeGoogleButton/NativeGoogleButton',
  () => ({
    __esModule: true,
    default: (props: GoogleButtonProps) => (
      <button
        data-testid="google-mock"
        onClick={() =>
          props.afterLogin({ credential: 'jwt-test', select_by: 'test' })
        }
      />
    ),
  }),
);

vi.mock('@/ui/components/atoms/loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
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
vi.mock('@/ui/context/auth/Auth', () => ({
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Consumer: ({ children }: { children: React.ReactNode }) => children,
  },
}));

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({ login: loginSpy }),
  };
});

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn().mockReturnValue(false),
  },
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully with web Google button', async () => {
    render(<Login />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    expect(screen.getByTestId('google-web-mock')).toBeInTheDocument();
  });

  it('should call fetch when web button is clicked', async () => {
    render(<Login />);

    await waitFor(() => {
      expect(screen.getByTestId('google-web-mock')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('google-web-mock'));
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should render native Google button when on native platform', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    render(<Login />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    expect(screen.getByTestId('google-mock')).toBeInTheDocument();
  });

  it('should call fetch when native button is clicked', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    render(<Login />);

    await waitFor(() => {
      expect(screen.getByTestId('google-mock')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('google-mock'));
    expect(loginSpy).toHaveBeenCalled();
  });
});
