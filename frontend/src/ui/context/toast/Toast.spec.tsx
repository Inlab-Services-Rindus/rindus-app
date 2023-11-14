import { Toast } from '@/ui/context/toast/Toast';

import { render } from '@testing-library/react';

describe('Toast', () => {
  it('should render', () => {
    const { container } = render(<Toast />);

    expect(container.querySelector('#toast-container')).toBeInTheDocument();
  });
});
