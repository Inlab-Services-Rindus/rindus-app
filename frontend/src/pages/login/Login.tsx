import { useContext } from 'react';

import GoogleButton from '@/atoms/buttons/google/GoogleButton';
import { AuthContext } from '@/context/auth/Auth';
import { Header } from '@/organisms/header/Header';
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
