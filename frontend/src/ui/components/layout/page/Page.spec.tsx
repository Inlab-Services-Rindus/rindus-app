import Page from '@/ui/components/layout/page/Page';
import { render, screen } from '@testing-library/react';

vi.mock('@/ui/components/organisms/header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));
describe('Page', () => {
  it('should render successfully', () => {
    render(
      <Page>
        <div>Test</div>
      </Page>,
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
