import Retry from '@/components/organisms/retry/Retry';

import { render, screen } from '@testing-library/react';

describe('Retry', () => {
  it('should render successfully', () => {
    render(<Retry refresh={vi.fn()} />);

    expect(
      screen.getByText(
        'Oops! Something went wrong. Please click to refresh and try again.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
  });
});
