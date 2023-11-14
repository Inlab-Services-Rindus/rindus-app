import RindusLogo from '@/ui/components/atoms/buttons/rindus-logo/RindusLogo';
import { fireEvent, render, screen } from '@testing-library/react';

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
