import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export interface useFetchProps {
  onErrorCallback: () => void;
  url: string;
  options?: RequestInit;
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
}: useFetchProps): useFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_1, _2, removeCookie] = useCookies();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url, { ...options });

      if (!response.ok) {
        if (response.status === 401) {
          removeCookie('session');
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
  }, []);

  const refresh = () => {
    fetchData();
  };

  return { data, isLoading, refresh };
}
