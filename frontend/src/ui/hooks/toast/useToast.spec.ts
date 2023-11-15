import * as toastMock from 'react-toastify';

import useToast from '@/ui/hooks/toast/useToast';

import { renderHook } from '@testing-library/react';

describe('useToast', () => {
  it('showToastSuccess should call toast.success', () => {
    const successSpy = vi.spyOn(toastMock.toast, 'success');

    const { result } = renderHook(() => useToast());
    result.current.showToastSuccess('This is a success message');

    expect(successSpy).toHaveBeenCalledWith('This is a success message');
  });
  it('showToastInfo should call toast.info', () => {
    const infoSpy = vi.spyOn(toastMock.toast, 'info');

    const { result } = renderHook(() => useToast());
    result.current.showToastInfo('This is an info message');

    expect(infoSpy).toHaveBeenCalledWith('This is an info message');
  });

  it('showToastError should call toast.error', () => {
    const errorSpy = vi.spyOn(toastMock.toast, 'error');

    const { result } = renderHook(() => useToast());
    result.current.showToastError('This is an error message');

    expect(errorSpy).toHaveBeenCalledWith('This is an error message');
  });

  it('showToastWarning should call toast.warning', () => {
    const warningSpy = vi.spyOn(toastMock.toast, 'warning');

    const { result } = renderHook(() => useToast());
    result.current.showToastWarning('This is a warning message');

    expect(warningSpy).toHaveBeenCalledWith('This is a warning message');
  });
});
