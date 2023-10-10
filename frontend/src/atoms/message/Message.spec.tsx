import Message from '@/atoms/message/Message';

import { render, screen } from '@testing-library/react';

describe('Message', () => {
  it('should render text passed by props', () => {
    render(<Message message="test" />);

    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
