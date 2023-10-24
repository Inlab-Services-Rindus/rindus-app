import { mockUsersResponse } from '@/model/__mocks__/fetch/Employee';
import { PeopleTab } from '@/organisms/people-tab/PeopleTab';

import { render, screen, fireEvent } from '@testing-library/react';

describe('PeopleTab', () => {
  it('renders a list of people', () => {
    render(
      <PeopleTab
        people={mockUsersResponse}
        isPeopleLoading={false}
        refreshPeople={() => {}}
      />,
    );

    expect(
      screen.getByText(mockUsersResponse[0].firstName),
    ).toBeInTheDocument();
  });

  it('calls refreshPeople when retry button is clicked', () => {
    const mockRefreshPeople = vi.fn();
    render(
      <PeopleTab
        people={[]}
        isPeopleLoading={true}
        refreshPeople={mockRefreshPeople}
      />,
    );
    const refreshButton = screen.getByTestId('refresh-button');

    fireEvent.click(refreshButton);

    expect(mockRefreshPeople).toHaveBeenCalled();
  });
});
