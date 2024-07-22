import EventsTab from '@/ui/section/home/events-tab/EventsTab';
import { render, screen } from '@testing-library/react';

import { StoreContext, getInitialStoreContext } from '@/ui/context/store/Store';

const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

describe('Events tab', () => {
  it('should render spinner when events is loading', () => {
    render(
      <StoreContext.Provider
        value={{
          ...getInitialStoreContext(),
          events: {
            data: [],
            isLoading: true,
            hasError: false,
          },
        }}
      >
        <EventsTab />
      </StoreContext.Provider>,
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render retry component when the call has an error', () => {
    render(
      <StoreContext.Provider
        value={{
          ...getInitialStoreContext(),
          events: {
            data: [],
            isLoading: false,
            hasError: true,
          },
        }}
      >
        <EventsTab />
      </StoreContext.Provider>,
    );

    expect(screen.getByTestId('retry-component')).toBeInTheDocument();
  });

  it('should render event cards when events are loaded', () => {
    render(
      <StoreContext.Provider
        value={{
          ...getInitialStoreContext(),
          events: {
            data: [
              {
                id: '1',
                name: 'Title event',
                month: 'January',
                day: '01',
                weekday: 'Monday',
                colour: '#000000',
                isOnlineEvent: false,
              },
            ],
            isLoading: false,
            hasError: false,
          },
        }}
      >
        <EventsTab />
      </StoreContext.Provider>,
    );

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Title event')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });

  it('should render all event cards', () => {
    render(
      <StoreContext.Provider
        value={{
          ...getInitialStoreContext(),
          events: {
            data: [
              {
                id: '1',
                name: 'Title event',
                month: 'January',
                day: '01',
                weekday: 'Monday',
                colour: '#000000',
                isOnlineEvent: true,
              },
              {
                id: '2',
                name: 'Title event 2',
                month: 'February',
                day: '02',
                weekday: 'Tuesday',
                colour: '#000001',
                isOnlineEvent: false,
              },
            ],
            isLoading: false,
            hasError: false,
          },
        }}
      >
        <EventsTab />
      </StoreContext.Provider>,
    );

    expect(screen.getAllByTestId('event-card')).toHaveLength(2);
  });
});
