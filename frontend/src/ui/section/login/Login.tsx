import { useContext } from 'react';

import GoogleButton from '@/ui/components/atoms/buttons/google/GoogleButton';

import { AuthContext } from '@/ui/context/auth/Auth';

import '@/ui/section/login/Login.scss';

export function Login() {
  const { login } = useContext(AuthContext);

  return (
    <div className="login" data-testid="login-page">
      <p>Probando</p>
      <div className="login__button">
        <GoogleButton afterLogin={login} />
      </div>
    </div>
  );
}
