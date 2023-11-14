import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Partner from '@/ui/section/partner/Partner';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SpyInstance } from 'vitest';

vi.mock('@/hooks/fetch/useFetch');
const useNavigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateSpy,
  };
});

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/partner/1']}>
      <Routes>
        <Route path="/partner/:id" element={<Partner />} />
      </Routes>
    </MemoryRouter>,
  );

describe.skip('Partner', () => {
  const globalFetchSpy = vi.spyOn(global, 'fetch');

  beforeEach(() => {
    globalFetchSpy.mockClear();
    useNavigateSpy.mockClear();
  });

  // it('should render partner info', async () => {
  //   mockFetchCalls(globalFetchSpy);
  //   renderComponent();

  //   await waitFor(() => {
  //     expect(screen.getByText(partnerMock.name)).toBeInTheDocument();
  //     expect(screen.getByText(partnerMock.description)).toBeInTheDocument();
  //     expect(
  //       screen.getByAltText(`${partnerMock.name} logo`),
  //     ).toBeInTheDocument();
  //     expect(screen.getAllByTestId('user-card')).toHaveLength(
  //       partnerMembersMock.members.length + partnerMembersMock.captains.length,
  //     );
  //   });
  // });

  // it('should navigate to profile page when id is provided', async () => {
  //   mockFetchCalls(globalFetchSpy);
  //   renderComponent();

  //   await waitFor(() => {
  //     const userCard = screen.getAllByTestId('user-card')[0];
  //     fireEvent.click(userCard);
  //   });

  //   expect(useNavigateSpy).toHaveBeenCalledWith(
  //     expect.stringMatching(/^\/profile\/\d+$/),
  //   );
  // });
});
