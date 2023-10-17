import useFetch, {
  useFetchProps,
  useFetchReturn,
} from '@/hooks/fetch/useFetch';
import { Employee } from '@/model/Employee';

import mockUsersResponse from '@mocks/responses/users/users.json';
import {
  RenderHookResult,
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';

const removeCookie = vi.fn();
vi.mock('react-cookie', async () => {
  const actual = (await vi.importActual('react-cookie')) as any;
  return {
    ...actual,
    useCookies: () => [{}, vi.fn(), removeCookie],
  };
});

const showToastWarningSpy = vi.fn();
vi.mock('@/hooks/toast/useToast', async () => {
  const actual = (await vi.importActual('@/hooks/toast/useToast')) as any;
  return {
    ...actual,
    default: () => ({
      showToastWarning: showToastWarningSpy,
    }),
  };
});

describe('useFetch', async () => {
  const mockData = mockUsersResponse;
  const mockUrl = 'https://example.com/api/data';
  const mockOptions = {};
  const mockErrorCallback = vi.fn();
  let data:
    | RenderHookResult<useFetchReturn<Employee[]>, useFetchProps>
    | undefined;

  const renderFetchHook = async () => {
    await act(async () => {
      data = renderHook(() =>
        useFetch({
          url: mockUrl,
          options: mockOptions,
          onErrorCallback: mockErrorCallback,
        }),
      );
    });
  };

  beforeEach(() => {
    data = undefined;
    vi.resetAllMocks();
  });

  it('should fetch data successfully', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockData),
    });

    await renderFetchHook();
    const { result } = data as unknown as RenderHookResult<
      useFetchReturn<Employee[]>,
      useFetchProps
    >;

    expect(result.current).toEqual({
      data: mockData,
      isLoading: false,
      refresh: expect.any(Function),
    });

    expect(mockErrorCallback).not.toHaveBeenCalled();
  });

  it('should call remove cookie and show toast when the status code of the request is 401', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await renderFetchHook();

    await waitFor(() => {
      expect(removeCookie).toHaveBeenCalledWith('isLogged');
      expect(showToastWarningSpy).toHaveBeenCalledWith(
        'Please, login to continue',
      );
    });
  });

  it('should call error callback when the status code is 4**/5**', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await renderFetchHook();
    const { result } = data as unknown as RenderHookResult<
      useFetchReturn<Employee[]>,
      useFetchProps
    >;

    expect(result.current).toEqual({
      data: null,
      isLoading: false,
      refresh: expect.any(Function),
    });
    expect(mockErrorCallback).toHaveBeenCalled();
  });

  it('should call error callback when there is an exception', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      throw: new Error('Error'),
    });

    await renderFetchHook();
    const { result } = data as unknown as RenderHookResult<
      useFetchReturn<Employee[]>,
      useFetchProps
    >;

    expect(result.current).toEqual({
      data: null,
      isLoading: false,
      refresh: expect.any(Function),
    });
    expect(mockErrorCallback).toHaveBeenCalled();
  });

  it('should fetch again when refresh function is called', async () => {
    global.fetch = vi.fn();

    await renderFetchHook();

    const { result } = data as unknown as RenderHookResult<
      useFetchReturn<Employee[]>,
      useFetchProps
    >;

    await result.current.refresh();

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
