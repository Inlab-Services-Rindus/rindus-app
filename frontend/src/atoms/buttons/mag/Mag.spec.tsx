import Mag from '@/atoms/buttons/mag/Mag';
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

describe('Mag', () => {
  it('should render the Mag button with the correct background and color', () => {
    render(<Mag background={SVGColorGreen} color={SVGColorWhite} />);

    const magButton = screen.getByTestId('mag');

    expect(magButton).toBeInTheDocument();
    expect(magButton).toHaveClass('button__logo button__logo--green');
    expect(magButton.querySelector('svg')).toBeInTheDocument();
    expect(magButton.querySelector('path')).toHaveAttribute(
      'fill',
      SvgColor[SVGColorWhite],
    );
  });

  it('should call onClick when clicked', () => {
    const handleOnClickSpy = vi.fn();

    render(
      <Mag
        onClick={handleOnClickSpy}
        background={SVGColorGreen}
        color={SVGColorWhite}
      />,
    );

    fireEvent.click(screen.getByTestId('mag'));
    expect(handleOnClickSpy).toHaveBeenCalled();
  });
});
