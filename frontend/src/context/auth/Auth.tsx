import { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { config } from '@/config/config';
import useToast from '@/hooks/toast/useToast';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (
    googleResponse: google.accounts.id.CredentialResponse,
  ) => Promise<void>;
  isLoading: boolean;
  logout: () => Promise<void>;
  userProfileData?: userProfileData;
}

interface userProfileData {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  profilePictureUrl?: string;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userProfileData: undefined,
  login: async () => {},
  isLoading: true,
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState<userProfileData>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePictureUrl: '',
  });

  useEffect(() => {
    softLogin();
  }, []);

  const navigate = useNavigate();

  const { showToastError, showToastSuccess } = useToast();

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

    setIsLoading(false);
    if (response.ok) {
      const data = await response.json();

      setIsLoggedIn(true);
      setUserProfileData(data);
      navigate('/');
    } else {
      showToastError('Login failed');
    }
  };

  const softLogin = async () => {
    const response = await fetch(`${config.backendUrl}/soft-login`, {
      credentials: 'include',
    });

    setIsLoading(false);
    if (response.ok) {
      const user = await response.json();

      setIsLoggedIn(true);
      setUserProfileData(user);
      navigate('/');
    } else {
      if (response.status !== 400) {
        showToastError('Login expired');
      }
    }
  };

  const logout = async () => {
    const response = await fetch(`${config.backendUrl}/logout`, {
      credentials: 'include',
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
    userProfileData,
    isLoggedIn,
    login,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
