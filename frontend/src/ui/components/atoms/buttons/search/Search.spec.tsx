import Search from '@/ui/components/atoms/buttons/search/Search';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Search', () => {
  it('should render the Search button', () => {
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
