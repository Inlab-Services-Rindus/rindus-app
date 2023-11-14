import { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '@/modules/auth/application/login/login';
import { logout } from '@/modules/auth/application/logout/logout';
import { softLogin } from '@/modules/auth/application/soft-login/soft-login';
import { createAuthRepository } from '@/modules/auth/infrastructure/AuthRepository';
import useToast from '@/ui/hooks/toast/useToast';

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
  const authRepository = createAuthRepository();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState<userProfileData>({
    id: '',
    profilePictureUrl: '',
  });

  useEffect(() => {
    actionSoftLogin();
  }, []);

  const navigate = useNavigate();

  const { showToastError, showToastWarning, showToastSuccess } = useToast();

  const actionLogin = async (
    googleResponse: google.accounts.id.CredentialResponse,
  ) => {
    try {
      setIsLoading(true);

      const user = await login(authRepository, googleResponse.credential);

      setIsLoading(false);

      if (user) {
        setIsLoggedIn(true);
        setUserProfileData(user);
        navigate('/');
      } else {
        showToastError('Login failed');
      }
    } catch (error) {
      showToastError('Login failed');
    }
  };

  const actionSoftLogin = async () => {
    try {
      setIsLoading(true);

      const user = await softLogin(authRepository);

      setIsLoading(false);

      if (user) {
        setIsLoggedIn(true);
        setUserProfileData(user);
        navigate('/');
      } else {
        showToastWarning('Login expired');
      }
    } catch (error) {
      showToastWarning('Login expired');
    }
  };

  const actionLogout = async () => {
    try {
      setIsLoading(true);

      const isSuccess = await logout(authRepository);

      setIsLoading(false);

      if (isSuccess) {
        setIsLoggedIn(false);
        setUserProfileData({
          id: '',
          profilePictureUrl: '',
        });
        navigate('/login');
        showToastSuccess('Logout successful');
      } else {
        showToastError('Logout unsuccessful');
      }
    } catch (error) {
      showToastError('Logout unsuccessful');
    }
  };

  const contextValue: AuthContextType = {
    userProfileData,
    isLoggedIn,
    login: actionLogin,
    isLoading,
    logout: actionLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
