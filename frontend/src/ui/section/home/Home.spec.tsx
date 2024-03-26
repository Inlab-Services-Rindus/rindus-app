import { Home } from '@/ui/section/home/Home';
import { render, screen } from '@testing-library/react';

vi.mock('@/ui/section/home/people-tab/PeopleTab', () => ({
  default: () => <div data-testid="people-tab">PeopleTab</div>,
}));

describe('Home', () => {
  it('should render people tab by default', () => {
    render(<Home />);

    expect(screen.getByTestId('tab-panel')).toBeInTheDocument();
    expect(screen.getByTestId('people-tab')).toBeInTheDocument();
  });
});
