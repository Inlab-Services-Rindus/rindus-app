import { BackButton } from '@/components/atoms/buttons/back/BackButton';

import { render, screen } from '@testing-library/react';

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('BackButton', () => {
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

    expect(useNavigateSpy).toHaveBeenCalled();
  });
});
