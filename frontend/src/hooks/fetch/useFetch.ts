import { useEffect, useState } from 'react';

export interface useFetchProps {
  onUnauthorizedCallback: () => void;
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
  onUnauthorizedCallback,
  onErrorCallback,
  url,
  options,
}: useFetchProps): useFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url, { ...options });

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorizedCallback();
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
