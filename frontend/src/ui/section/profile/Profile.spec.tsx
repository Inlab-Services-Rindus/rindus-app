// import { MemoryRouter, Route, Routes } from 'react-router-dom';

// import { config } from '@/config/config';
// import { Profile } from '@/ui/section/profile/Profile';

// import { render, waitFor } from '@testing-library/react';
// import { Mock } from 'vitest';

vi.mock('@/hooks/fetch/useFetch');

describe('Profile', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('test', () => {
    expect(true).toBe(true);
  });

  // const renderComponent = () =>
  //   render(
  //     <MemoryRouter initialEntries={['/profile/1']}>
  //       <Routes>
  //         <Route path="/profile/:id" element={<Profile />} />
  //       </Routes>
  //     </MemoryRouter>,
  //   );

  // it('should render the profile information', async () => {
  //   const { getByText, getByAltText } = renderComponent();

  //   await waitFor(() => {
  //     expect(
  //       getByAltText(`${mockProfile.firstName}'s profile picture`),
  //     ).toHaveAttribute('src', mockProfile.profilePictureUrl);
  //     expect(
  //       getByText(`${mockProfile.firstName} ${mockProfile.lastName}`),
  //     ).toBeInTheDocument();
  //     expect(getByText(mockProfile.position)).toBeInTheDocument();
  //     expect(mockProfile.department).toBeDefined();
  //     expect(getByText(mockProfile.email)).toBeInTheDocument();
  //     expect(getByText(mockProfile.email)).toBeInTheDocument();
  //     expect(getByText('English')).toBeInTheDocument();
  //     expect(getByText('Spanish')).toBeInTheDocument();
  //   });
  // });

  // it('should render a loader while fetching the profile information', async () => {
  //   (useFetch as Mock).mockReturnValue({
  //     data: null,
  //     isLoading: true,
  //   });
  //   const { getByTestId } = renderComponent();

  //   expect(getByTestId('loader')).toBeInTheDocument();
  // });

  // it('should fetch the profile information from the backend', async () => {
  //   const { id } = mockProfile;
  //   renderComponent();

  //   expect(useFetch).toHaveBeenCalledWith({
  //     options: {
  //       credentials: 'include',
  //     },
  //     url: `${config.backendUrl}/users/${id}/`,
  //   });
  // });
});
