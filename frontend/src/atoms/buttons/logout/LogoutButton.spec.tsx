import LogoutButton from '@/atoms/buttons/logout/LogoutButton';

import { render, screen } from '@testing-library/react';

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render succesfully', () => {
    render(<LogoutButton />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });
  // it('should call logout when button is clicked', () => {
  //   const logoutSpy = vi.fn();
  //   render(
  //     <AuthContext.Provider
  //       value={{ isLoggedIn: false, login: vi.fn(), logout: logoutSpy }}
  //     >
  //       <LogoutButton />
  //     </AuthContext.Provider>,
  //   );

  //   fireEvent.click(screen.getByRole('button'));

  //   expect(logoutSpy).toHaveBeenCalled();
  // });
});
