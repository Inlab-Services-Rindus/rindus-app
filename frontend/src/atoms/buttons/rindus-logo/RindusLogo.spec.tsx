import RindusLogo from '@/atoms/buttons/rindus-logo/RindusLogo';
import { SVGColorGreen, SVGColorWhite, SvgColor } from '@/constants/svgColor';

import { fireEvent, render, screen } from '@testing-library/react';

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('RindusLogo', () => {
  it('should render the RindusLogo button with the correct background and color', () => {
    render(<RindusLogo background={SVGColorGreen} color={SVGColorWhite} />);

    const logoButton = screen.getByTestId('logo');

    expect(logoButton).toBeInTheDocument();
    expect(logoButton).toHaveClass('button__logo button__logo--green');
    expect(logoButton.querySelector('svg')).toBeInTheDocument();
    expect(logoButton.querySelector('path')).toHaveAttribute(
      'fill',
      SvgColor[SVGColorWhite],
    );
  });

  it('should call onClick when clicked', () => {
    const handleOnClickSpy = vi.fn();

    render(
      <RindusLogo
        onClick={handleOnClickSpy}
        background={SVGColorGreen}
        color={SVGColorWhite}
      />,
    );

    fireEvent.click(screen.getByTestId('logo'));
    expect(handleOnClickSpy).toHaveBeenCalled();
  });
});
