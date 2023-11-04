import { fireEvent, render, screen } from '@testing-library/react';

import RindusLogo from '@/atoms/buttons/rindus-logo/RindusLogo';

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('RindusLogo', () => {
  it('should render the RindusLogo button', () => {
    render(<RindusLogo />);

    const logoButton = screen.getByTestId('rindusLogo');

    expect(logoButton).toBeInTheDocument();
    expect(logoButton.querySelector('img')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleOnClickSpy = vi.fn();

    render(<RindusLogo onClick={handleOnClickSpy} />);

    fireEvent.click(screen.getByTestId('rindusLogo'));
    expect(handleOnClickSpy).toHaveBeenCalled();
  });
});
