import { useContext } from 'react';

import rindusLogo from '@/assets/rindus-logo.svg';
import GoogleButton from '@/atoms/buttons/google/GoogleButton';
import { Image } from '@/atoms/image/Image';
import { AuthContext } from '@/context/auth/Auth';
import '@/pages/login/Login.scss';

export function Login() {
  const { login } = useContext(AuthContext);

  return (
    <div className="container" data-testid="login-page">
      <div className="login-header">
        <Image className="login-header__logo" src={rindusLogo} />
      </div>
      <div className="login__button">
        <GoogleButton afterLogin={login} />
      </div>
    </div>
  );
}
