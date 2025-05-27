import { useContext, lazy, Suspense } from 'react';

import Loader from '@/ui/components/atoms/loader/Loader';
import { Capacitor } from '@capacitor/core';

import { AuthContext } from '@/ui/context/auth/Auth';

import '@/ui/section/login/Login.scss';

const GoogleButton = lazy(
  () => import('@/ui/components/atoms/buttons/google/GoogleButton'),
);
const NativeGoogleButton = lazy(
  () =>
    import(
      '@/ui/components/atoms/buttons/nativeGoogleButton/NativeGoogleButton'
    ),
);

export function Login() {
  const { login } = useContext(AuthContext);
  const isNative = Capacitor.isNativePlatform();

  return (
    <div className="login" data-testid="login-page">
      <div className="login__button">
        <Suspense fallback={<Loader />}>
          {isNative ? (
            <NativeGoogleButton afterLogin={login} />
          ) : (
            <GoogleButton afterLogin={login} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
