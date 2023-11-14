import GoogleButton from '@/ui/components/atoms/buttons/google/GoogleButton';

import { render, screen, fireEvent } from '@testing-library/react';

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

describe('GoogleButton', () => {
  const afterLogin = vi.fn();

  it('should render successfully', () => {
    render(<GoogleButton afterLogin={afterLogin} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should contain Sign in with Google text', () => {
    render(<GoogleButton afterLogin={afterLogin} />);

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('should call handleLogin when the user clicks on the button', () => {
    render(<GoogleButton afterLogin={afterLogin} />);

    fireEvent.click(screen.getByRole('button'));

    expect(google.accounts.id.initialize).toHaveBeenCalledWith({
      callback: afterLogin,
      client_id:
        '794492959607-21m9v38tca8f0i957p9bk67li2g7nt9b.apps.googleusercontent.com',
    });
    expect(google.accounts.id.prompt).toHaveBeenCalled();
  });
});
