import { BackButton } from '@/atoms/buttons/back/BackButton';

import { render, screen } from '@testing-library/react';

describe('RefreshButton', () => {
  it('should render successfully', () => {
    render(<BackButton />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });

  it('should call handleBack when button is clicked', () => {
    window.history.back = vi.fn();
    render(<BackButton />);
    const buttonElement = screen.getByRole('button');

    buttonElement.click();

    expect(window.history.back).toHaveBeenCalled();
  });
});
