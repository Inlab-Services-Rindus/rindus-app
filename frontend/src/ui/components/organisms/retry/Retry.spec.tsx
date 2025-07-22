import Retry from '@/ui/components/organisms/retry/Retry';
import { render, screen } from '@testing-library/react';

describe('Retry', () => {
  it('should render successfully with the error message and show the refresh button', () => {
    render(
      <Retry
        refresh={vi.fn()}
        message="Oops! Something went wrong. Please click to refresh and try again."
      />,
    );

    expect(
      screen.getByText(
        'Oops! Something went wrong. Please click to refresh and try again.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
  });

  it('should render successfully without showing the refresh button for other messages', () => {
    render(<Retry refresh={vi.fn()} message="No results found." />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(screen.queryByTestId('refresh-button')).not.toBeInTheDocument(); // Verifica que el botón no aparece
  });
});
