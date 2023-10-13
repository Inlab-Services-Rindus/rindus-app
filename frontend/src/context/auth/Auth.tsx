import { createContext, useState, ReactNode, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import { config } from '@/config/config';
import useToast from '@/hooks/toast/useToast';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (
    googleResponse: google.accounts.id.CredentialResponse,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [cookies] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies['connect.sid']);

  const navigate = useNavigate();

  const { showToastError, showToastSuccess } = useToast();

  useEffect(() => {
    setIsLoggedIn(!!cookies['connect.sid']);
  }, [cookies['connect.sid']]);

  const login = async (
    googleResponse: google.accounts.id.CredentialResponse,
  ) => {
    const response = await fetch(`${config.backendUrl}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ jwt: googleResponse.credential }),
      method: 'POST',
    });

    if (response.ok) {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      showToastError('Login failed');
    }
  };

  const logout = async () => {
    const response = await fetch(`${config.backendUrl}/logout`, {
      method: 'POST',
    });

    if (response.ok) {
      setIsLoggedIn(false);

      navigate('/login');
      showToastSuccess('Logout successful');
    } else {
      setIsLoggedIn(true);
      showToastError('Logout unsuccessful');
    }
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
