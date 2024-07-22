import EventCard from '@/ui/components/atoms/event-card/EventCard';
import { render, screen } from '@testing-library/react';

const defaultProps = {
  title: 'Pizza Day',
  month: 'January',
  day: '01',
  weekday: 'Monday',
  colour: '#000000',
  isOnlineEvent: false,
};

describe('EventCard', () => {
  it('should render all the texts passed by props', () => {
    render(<EventCard {...defaultProps} />);
    const RightButton = screen.queryByRole('button', { name: 'SVG right' });
    const eventCardDate = screen.getByTestId('event-card-date');
    const eventCardTitle = screen.queryByText(defaultProps.title);

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.day)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.weekday)).toBeInTheDocument();
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
    const eventCardTitle = screen.getByText(defaultProps.title);

    expect(eventCardTitle).toHaveClass('details__title--bold');
  });

  it('should render EventSummary when isButtonVisible is false and isOnlineEvent is true', () => {
    render(<EventCard {...defaultProps} isButtonVisible={false} isOnlineEvent={true} />);
    const eventSummary = screen.getByTestId('event-summary');

    expect(eventSummary).toBeInTheDocument();
    expect(screen.getByText('Online Event')).toBeInTheDocument();
  });

  it('should not render EventSummary when isButtonVisible is true', () => {
    render(<EventCard {...defaultProps} isButtonVisible={true} isOnlineEvent={true} />);
    const eventSummary = screen.queryByTestId('event-summary');

    expect(eventSummary).not.toBeInTheDocument();
  });
});
