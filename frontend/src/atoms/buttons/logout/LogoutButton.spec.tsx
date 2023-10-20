import LogoutButton from '@/atoms/buttons/logout/LogoutButton';

import { fireEvent, render, screen } from '@testing-library/react';

const logoutSpy = vi.fn();
vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({ logout: logoutSpy }),
  };
});

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render succesfully', () => {
    render(<LogoutButton />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });

  it('should call logout when button is clicked', () => {
    render(<LogoutButton />);

    fireEvent.click(screen.getByRole('button'));

    expect(logoutSpy).toHaveBeenCalled();
  });
});
