import EventCard from '@/ui/components/atoms/event-card/EventCard';
import { render, screen } from '@testing-library/react';

const defaultProps = {
  title: 'Pizza Day',
  month: 'January',
  day: '01',
  weekday: 'Monday',
  colour: '#000000',
};

describe('EventCard', () => {
  it('should render all the texts passed by props', () => {
    render(<EventCard {...defaultProps} />);
    const RightButton = screen.queryByRole('button', { name: 'SVG right' });
    const eventCardDate = screen.getByTestId('event-card-date');
    const eventCardTitle = screen.getByTestId('event-card-title');

    expect(screen.getByText('Jan'));
    expect(screen.getByText('Pizza Day'));
    expect(screen.getByText('01'));
    expect(screen.getByText('Monday'));
    expect(eventCardDate).toHaveStyle({ backgroundColor: '#000000' });
    expect(RightButton).not.toBeInTheDocument();
    expect(eventCardTitle).not.toHaveClass('details__title--bold');
  });

  it('should render arrow button when isButtonVisible is true', () => {
    render(<EventCard {...defaultProps} isButtonVisible />);
    const RightButton = screen.getByRole('button', { name: 'SVG right' });

    expect(RightButton).toBeInTheDocument();
  });

  it('should render bold title when isBoldTitle is true', () => {
    render(<EventCard {...defaultProps} isBoldTitle />);
    const eventCardTitle = screen.getByTestId('event-card-title');

    expect(eventCardTitle).toHaveClass('details__title--bold');
  });
});
