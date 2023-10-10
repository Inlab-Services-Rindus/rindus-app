import { render } from '@testing-library/react';
import { Toast } from '@/context/toast/Toast';

describe('Toast', () => {
  it('should render', () => {
    const { container } = render(<Toast />);

    expect(container.querySelector('#toast-container')).toBeInTheDocument();
  });
});
