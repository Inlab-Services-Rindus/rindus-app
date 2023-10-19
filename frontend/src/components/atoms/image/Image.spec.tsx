import { Image } from '@/components/atoms/image/Image';

import { render, screen } from '@testing-library/react';

describe('Image', () => {
  it('should render successfully', () => {
    const { container } = render(
      <Image className="myNewClass" src="test.png" />,
    );

    expect(screen.getByTestId('image')).toBeInTheDocument();
    expect(container.querySelector('.myNewClass')).toBeInTheDocument();
    expect(container.querySelector('.image')).toHaveAttribute(
      'src',
      'test.png',
    );
  });
});
