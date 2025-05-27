// Import the GoogleAuth object and Capacitor platform utilities
import { useEffect } from 'react';

import {
  GoogleLoginResponseOnline,
  SocialLogin,
} from '@capgo/capacitor-social-login';

import '@/ui/components/atoms/buttons/nativeGoogleButton/NativeGoogleButton.scss';

export interface GoogleButtonProps {
  afterLogin: (token: google.accounts.id.CredentialResponse) => void;
}

export default function NativeGoogleButton({
  afterLogin,
}: GoogleButtonProps): JSX.Element {
  // Initialize GoogleAuth when component mounts
  useEffect(() => {
    SocialLogin.initialize({
      google: {
        webClientId:
          '107296892437-s1m61pk81b6qqj9g9u60ocml7m8vmnq2.apps.googleusercontent.com', // the web client id for Android and Web
      },
    });
  }, []);

  async function signIn() {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });

    console.log('Pedro ===> res', res);

    const result = res?.result as GoogleLoginResponseOnline;
    const token = result.idToken;

    console.log('Pedro ===> token', token);

    const credentialResponse = {
      credential: token,
      select_by: 'user',
    } as unknown as google.accounts.id.CredentialResponse;

    afterLogin(credentialResponse);
  }

  return (
    <div id="google__button" onClick={() => signIn()}>
      Sign in with Google
    </div>
  );
}
