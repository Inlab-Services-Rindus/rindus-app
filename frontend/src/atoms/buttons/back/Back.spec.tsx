import Back from '@/atoms/buttons/back/Back';

import { render, screen } from '@testing-library/react';

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('Back', () => {
  beforeEach(() => {
    useNavigateSpy.mockClear();
  });

  it('should render successfully', () => {
    render(<Back />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.querySelector('svg')).toBeInTheDocument();
  });

  it('should call handleBack when button is clicked', () => {
    window.history.back = vi.fn();
    render(<Back />);
    const buttonElement = screen.getByRole('button');

    buttonElement.click();

    expect(useNavigateSpy).toHaveBeenCalled();
  });
});
