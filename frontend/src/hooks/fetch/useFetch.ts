import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/context/auth/Auth';
import useToast from '@/hooks/toast/useToast';

export interface useFetchProps {
  onErrorCallback: () => void;
  url: string;
  options?: RequestInit;
  deps?: string;
}

export interface useFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  refresh: () => void;
}

export default function useFetch<T>({
  onErrorCallback,
  url,
  options,
  deps = '',
}: useFetchProps): useFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useContext(AuthContext);

  const { showToastWarning } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url, { ...options });

      if (!response.ok) {
        if (response.status === 401) {
          await logout();
          showToastWarning('Please, login to continue');
        } else {
          onErrorCallback();
        }
      } else {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      onErrorCallback();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deps]);

  const refresh = () => {
    fetchData();
  };

  return { data, isLoading, refresh };
}
