import RefreshButton from '@/ui/components/atoms/buttons/refresh/RefreshButton';

import { render, screen } from '@testing-library/react';

describe('RefreshButton', () => {
  const handleRefresh = vi.fn();

  it('should render successfully', () => {
    render(<RefreshButton handleRefresh={handleRefresh} />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });

  it('should render the refresh icon', () => {
    render(<RefreshButton handleRefresh={handleRefresh} />);
    const refreshIcon = screen.getByAltText('refresh');

    expect(refreshIcon).toBeInTheDocument();
  });

  it('should call handleRefresh when button is clicked', () => {
    render(<RefreshButton handleRefresh={handleRefresh} />);
    const buttonElement = screen.getByRole('button');

    buttonElement.click();

    expect(handleRefresh).toHaveBeenCalled();
  });
});
