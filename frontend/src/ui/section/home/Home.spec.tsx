import { Home } from '@/ui/section/home/Home';
import { act, render, screen } from '@testing-library/react';

vi.mock('@/ui/section/home/people-tab/PeopleTab', () => ({
  default: () => <div data-testid="people-tab">PeopleTab</div>,
}));

vi.mock('@/ui/section/home/partners-tab/PartnersTab', () => ({
  default: () => <div data-testid="partners-tab">PartnersTab</div>,
}));

describe.skip('Home', () => {
  it('should render people tab by default', () => {
    render(<Home />);

    expect(screen.getByTestId('tab-panel')).toBeInTheDocument();
    expect(screen.getByTestId('people-tab')).toBeInTheDocument();
  });

  it('should render partner tab when change the tab', () => {
    render(<Home />);

    act(() => {
      screen.getAllByRole('button')[1].click();
    });

    expect(screen.getByTestId('tab-panel')).toBeInTheDocument();
    expect(screen.getByTestId('partners-tab')).toBeInTheDocument();
  });
});
