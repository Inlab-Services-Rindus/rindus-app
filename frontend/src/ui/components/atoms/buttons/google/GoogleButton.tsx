import { useEffect } from 'react';

export interface GoogleButtonProps {
  afterLogin: (token: google.accounts.id.CredentialResponse) => void;
}

export default function GoogleButto({
  afterLogin,
}: GoogleButtonProps): JSX.Element {
  useEffect(() => {
    google.accounts.id.initialize({
      callback: afterLogin,
      client_id:
        '794492959607-21m9v38tca8f0i957p9bk67li2g7nt9b.apps.googleusercontent.com',
    });

    const div = document.getElementById('google__button') as HTMLElement;

    google.accounts.id.renderButton(div, {
      type: 'standard',
      shape: 'pill',
      size: 'large',
    });
  }, []);

  return <div id="google__button" />;
}
