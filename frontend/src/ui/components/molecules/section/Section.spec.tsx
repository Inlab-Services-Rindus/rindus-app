import Tab from '@/ui/components/molecules/section/Section';

import { render, screen } from '@testing-library/react';

describe('Tab', () => {
  it('renders children', () => {
    render(<Tab isLoading={false}>Test</Tab>);

    const tabElement = screen.getByText(/Test/);

    expect(tabElement).toBeInTheDocument();
  });

  it('renders Loader when isLoading is true', () => {
    render(<Tab isLoading>Test</Tab>);

    const loaderElement = screen.getByTestId('loader');

    expect(loaderElement).toBeInTheDocument();
  });

  it('renders Retry when refresh and shouldRefresh are true', () => {
    const refreshMock = vi.fn();

    render(
      <Tab isLoading={false} refresh={refreshMock} shouldRefresh>
        Test
      </Tab>,
    );

    const retryElement = screen.getByTestId('retry-component');

    expect(retryElement).toBeInTheDocument();
  });
});
