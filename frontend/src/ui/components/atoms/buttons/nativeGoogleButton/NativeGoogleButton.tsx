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
  async function signIn() {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });

    const result = res?.result as GoogleLoginResponseOnline;
    const token = result.idToken;

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
