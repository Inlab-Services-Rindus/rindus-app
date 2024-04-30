import { useEffect } from 'react';

import '@/ui/components/atoms/buttons/google/GoogleButton.scss';

export interface GoogleButtonProps {
  afterLogin: (token: google.accounts.id.CredentialResponse) => void;
}

export default function GoogleButto({
  afterLogin,
}: GoogleButtonProps): JSX.Element {
  useEffect(() => {
    if (window?.google?.accounts?.id) {
      window?.google?.accounts?.id?.initialize({
        callback: afterLogin,
        client_id:
          '107296892437-s1m61pk81b6qqj9g9u60ocml7m8vmnq2.apps.googleusercontent.com',
      });
    }

    const div = document.getElementById('google__button') as HTMLElement;

    window?.google?.accounts?.id?.renderButton(div, {
      type: 'standard',
      shape: 'pill',
      size: 'large',
    });
  }, []);

  return <div id="google__button" />;
}
