import '@/ui/components/atoms/buttons/google/GoogleButton.scss';

export interface GoogleButtonProps {
  afterLogin: (token: google.accounts.id.CredentialResponse) => void;
}

export default function GoogleButton({
  afterLogin,
}: GoogleButtonProps): JSX.Element {
  function handleGoogleLogin() {
    google.accounts.id.initialize({
      callback: afterLogin,
      client_id:
        '794492959607-21m9v38tca8f0i957p9bk67li2g7nt9b.apps.googleusercontent.com',
    });
    google.accounts.id.prompt();
  }

  return (
    <button className="google__button" onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
}
