import { createContext, useState, ReactNode } from 'react';
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
  userProfileData?: UserProfileData;
}

interface UserProfileData {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userProfileData: undefined,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies['isLogged']);
  const [userProfileData, setuserProfileData] = useState<UserProfileData>({
    id: '',
    email: '',
    name: '',
    imageUrl: '',
  });

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

    if (response.ok) {
      setIsLoggedIn(true);
      setCookie('isLogged', 'true');
      setuserProfileData({
        id: 'test user',
        email: 'test email',
        name: 'test name',
        imageUrl: 'https://placekitten.com/150/150',
      });
      navigate('/');
    } else {
      showToastError('Login failed');
    }
  };

  const logout = async () => {
    const response = await fetch(`${config.backendUrl}/logout`, {
      credentials: 'include',
      method: 'POST',
    });

    if (response.ok) {
      setIsLoggedIn(false);
      removeCookie('isLogged');

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
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
