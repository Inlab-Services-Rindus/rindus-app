import Search from '@/ui/components/atoms/buttons/search/Search';

import { fireEvent, render, screen } from '@testing-library/react';

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('Search', () => {
  it('should render the Mag button', () => {
    render(<Search />);

    const searchButton = screen.getByTestId('search');

    expect(searchButton).toBeInTheDocument();
    expect(searchButton.querySelector('img')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleOnClickSpy = vi.fn();

    render(<Search onClick={handleOnClickSpy} />);

    fireEvent.click(screen.getByTestId('search'));
    expect(handleOnClickSpy).toHaveBeenCalled();
  });
});
