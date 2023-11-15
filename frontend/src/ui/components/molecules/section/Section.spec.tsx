import Section from '@/ui/components/molecules/section/Section';
import { render, screen } from '@testing-library/react';

describe('Section', () => {
  it('renders children', () => {
    render(<Section isLoading={false}>Test</Section>);

    const tabElement = screen.getByText(/Test/);

    expect(tabElement).toBeInTheDocument();
  });

  it('renders Loader when isLoading is true', () => {
    render(<Section isLoading>Test</Section>);

    const loaderElement = screen.getByTestId('loader');

    expect(loaderElement).toBeInTheDocument();
  });

  it('renders Retry when refresh and shouldRefresh are true', () => {
    const refreshMock = vi.fn();

    render(
      <Section isLoading={false} refresh={refreshMock} shouldRefresh>
        Test
      </Section>,
    );

    const retryElement = screen.getByTestId('retry-component');

    expect(retryElement).toBeInTheDocument();
  });
});
