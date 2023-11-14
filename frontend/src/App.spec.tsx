import App from '@/App';
import { screen, render } from '@testing-library/react';

describe('App', () => {
  it('should render meata, header, loader and toast', () => {
    const { container } = render(<App />);

    expect(screen.getByTestId('header-login')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(container.querySelector('#toast-container')).toBeInTheDocument();
  });
});
