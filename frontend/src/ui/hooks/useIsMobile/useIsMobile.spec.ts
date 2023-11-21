import { act } from 'react-dom/test-utils';

import { renderHook } from '@testing-library/react';

import useIsMobile from '@/ui/hooks/useIsMobile/useIsMobile';

describe('useIsMobile', () => {
  it('should return true when window width is less than 768', () => {
    global.innerWidth = 767;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than 768', () => {
    global.innerWidth = 769;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return false when window width is equal to 768', () => {
    global.innerWidth = 768;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should update windowSize on window resize', () => {
    global.innerWidth = 769;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      global.innerHeight = 500;
      global.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);
  });
});
