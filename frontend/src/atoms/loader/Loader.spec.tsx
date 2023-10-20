import Loader from '@/atoms/loader/Loader';

import { render, screen } from '@testing-library/react';

describe('Loader', () => {
  it('should render successfully', () => {
    render(<Loader />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
