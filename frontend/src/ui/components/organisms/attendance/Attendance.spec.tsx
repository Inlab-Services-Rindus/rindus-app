import Attendance from '@/ui/components/organisms/attendance/Attendance';
import { render, screen } from '@testing-library/react';

let isLoadingSpy = true;
let isHasErrorSpy = true;

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useContext: () => ({
      isLoading: isLoadingSpy,
      hasError: isHasErrorSpy,
    }),
  };
});

describe('Attendance', () => {
  beforeEach(() => {
    isLoadingSpy = false;
    isHasErrorSpy = false;
  });

  it('should render a Loader if isLoading', async () => {
    isLoadingSpy = true;

    render(<Attendance />);

    expect(screen.getByRole('Loader')).toBeInTheDocument();
  });

  it('should render an error message if hasError', async () => {
    isHasErrorSpy = true;

    render(<Attendance />);

    expect(screen.findAllByAltText('Something went wrong')).toBeInTheDocument();
  });

  it('should render the attendees number', async () => {});

  it('should render the attendance', async () => {});
});












// const mockAttendanceData = {
//   totalGuests: 5,
//   attendees: [
//     { profilePictureUrl: 'url1', firstName: 'Maria' },
//     { profilePictureUrl: 'url2', firstName: 'Pepe' },
//   ],
// };


// Mock StoreContext
// jest.mock('@/ui/context/store/Store', () => ({
//   useContext: jest.fn(),
// }));

// describe('Attendance Component', () => {
//   it('renders loading state', () => {
//     useContext.mockReturnValueOnce({
//       attendance: { isLoading: true },
//     });

//     render(<Attendance />);

//     expect(screen.getByTestId('loader')).toBeInTheDocument();
//   });

//   it('renders error state', async () => {
//     useContext.mockReturnValueOnce({
//       attendance: { isLoading: false, hasError: true },
//     });

//     render(<Attendance />);

//     await waitFor(() => {
//       expect(screen.getByText('Something went wrong')).toBeInTheDocument();
//     });
//   });

//   it('renders attendees list', async () => {
//     useContext.mockReturnValueOnce({
//       attendance: {
//         isLoading: false,
//         hasError: false,
//         data: mockAttendanceData,
//       },
//     });

//     render(<Attendance />);

//     await waitFor(() => {
//       expect(
//         screen.getByText('5 guests already attending'),
//       ).toBeInTheDocument();
//       expect(screen.getAllByTestId('attendee-tile')).toHaveLength(2);
//     });
//   });

//   it('fetches attendance data on mount', () => {
//     const mockGetAttendance = jest.fn();
//     useContext.mockReturnValueOnce({
//       attendance: { isLoading: false, hasError: false, data: null },
//       getAttendance: mockGetAttendance,
//     });

//     render(<Attendance />);

//     expect(mockGetAttendance).toHaveBeenCalledWith(1);
//   });
// });
