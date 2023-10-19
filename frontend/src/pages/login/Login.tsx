import { useContext } from 'react';

import GoogleButton from '@/components/atoms/buttons/google/GoogleButton';
import { Header } from '@/components/organisms/header/Header';
import { AuthContext } from '@/context/auth/Auth';
import '@/pages/login/Login.scss';

export function Login() {
  const { login } = useContext(AuthContext);

  return (
    <div className="container" data-testid="login-page">
      <Header />
      <div className="login__button">
        <GoogleButton afterLogin={login} />
      </div>
    </div>
  );
}
