import Page from '@/organisms/layout/page/page';

import { render, screen } from '@testing-library/react';

const useNavigateSpy = vi.fn();
const useLocationSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
    useLocation: () => useLocationSpy,
  };
});

describe('Page', () => {
  it('should render successfully', () => {
    render(
      <Page>
        <div>Test</div>
      </Page>,
    );

    expect(screen.getByTestId('header-login')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
