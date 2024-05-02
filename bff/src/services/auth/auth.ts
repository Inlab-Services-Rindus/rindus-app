interface Auth {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export async function authBackend() {
  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');
  urlencoded.append('client_id', 'client');
  urlencoded.append('client_secret', 'secret');

  const response = await fetch('http://localhost:8080/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlencoded,
  });

  const data: Auth = await response.json();

  return data;
}
