import { fireEvent, render, screen } from '@testing-library/react';

import Logout from '@/atoms/buttons/logout/Logout';

const logoutSpy = vi.fn();
vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({ logout: logoutSpy }),
  };
});

describe('Logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render succesfully', () => {
    render(<Logout />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });

  it('should call logout when button is clicked', () => {
    render(<Logout />);

    fireEvent.click(screen.getByRole('button'));

    expect(logoutSpy).toHaveBeenCalled();
  });
});
