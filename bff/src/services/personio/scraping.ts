import https from 'https';

import { Config } from '@/config/config.type';
import { Employee } from '@/services/personio/personio';

export async function getPersonioData(config: Config): Promise<Employee[]> {
  const firstResponse = await firstRequest(config.personio.password);

  if (
    !firstResponse?.location &&
    !firstResponse?.cookies?.personio_browser_id &&
    !firstResponse?.cookies?.personio_session
  ) {
    throw new Error('Error first request');
  }

  const secondResponse = await secondRequest(
    firstResponse.location,
    firstResponse.cookies.personio_browser_id,
    firstResponse.cookies.personio_session,
  );

  if (!secondResponse?.location && !secondResponse?.cookies?.AWSALBAuthNonce) {
    throw new Error('Error second request');
  }

  const thirdResponse = await thirdRequest(
    secondResponse.location,
    firstResponse.cookies.personio_browser_id,
    firstResponse.cookies.personio_session,
  );

  if (!thirdResponse?.location && !thirdResponse?.cookies?.personio_session) {
    throw new Error('Error third request');
  }

  const fourthResponse = await fourthRequest(
    thirdResponse.location,
    firstResponse.cookies.personio_browser_id,
    thirdResponse.cookies.personio_session,
    secondResponse.cookies.AWSALBAuthNonce,
  );

  if (
    !fourthResponse?.location &&
    !fourthResponse?.cookies?.AWSELBAuthSessionCookie
  ) {
    throw new Error('Error four request');
  }

  const fifthResponse = await fifthRequest(
    firstResponse.cookies.personio_browser_id,
    thirdResponse.cookies.personio_session,
    fourthResponse.cookies.AWSELBAuthSessionCookie,
  );

  if (
    !fifthResponse?.cookies?.XSRF_TOKEN &&
    !fifthResponse?.cookies?.personio_session
  ) {
    throw new Error('Error fifth request');
  }

  const sixthResponse = await sixthRequest(
    firstResponse.cookies.personio_browser_id,
    fifthResponse.cookies.personio_session,
    fifthResponse.cookies.XSRF_TOKEN,
    secondResponse.cookies.AWSALBAuthNonce,
    fourthResponse.cookies.AWSELBAuthSessionCookie,
  );

  if (!sixthResponse.length) {
    throw new Error('Error sixth request');
  }

  return sixthResponse;
}

interface firstResponse {
  location: string;
  cookies: {
    personio_browser_id: string;
    personio_session: string;
  };
}

async function firstRequest(password: string): Promise<firstResponse> {
  const urlencoded = new URLSearchParams();
  urlencoded.append('email', 'inlab-services@rindus.de');
  urlencoded.append('password', password);

  const response = await fetch('https://rindus.personio.de/login/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlencoded,
    redirect: 'manual',
  });

  return {
    location: response.headers.get('location') || '',
    cookies: {
      personio_browser_id: response.headers.getSetCookie()![0].split(';')[0],
      personio_session: response.headers.getSetCookie()![1].split(';')[0],
    },
  };
}

interface SecondResponse {
  location: string;
  cookies: {
    AWSALBAuthNonce: string;
  };
}

async function secondRequest(
  url: string,
  personio_browser_id: string,
  personio_session: string,
): Promise<SecondResponse> {
  const cookies = `${personio_browser_id}; ${personio_session}`;
  const response = await fetch(url, {
    headers: {
      Cookie: cookies,
      connection: 'keep-alive',
    },
    redirect: 'manual',
  });

  return {
    location: response.headers.get('location') || '',
    cookies: {
      AWSALBAuthNonce: response.headers.getSetCookie()![0].split(';')[0],
    },
  };
}

interface ThirdResponse {
  location: string;
  cookies: {
    personio_session: string;
  };
}

async function thirdRequest(
  url: string,
  personio_browser_id: string,
  personio_session: string,
): Promise<ThirdResponse> {
  const cookies = `${personio_browser_id}; ${personio_session}`;

  const response = await fetch(url, {
    headers: {
      Cookie: cookies,
    },
    redirect: 'manual',
  });

  return {
    location: response.headers.get('location') || '',
    cookies: {
      personio_session: response.headers.getSetCookie()![0].split(';')[0],
    },
  };
}

interface FourthResponse {
  location: string;
  cookies: {
    AWSELBAuthSessionCookie: string;
  };
}

async function fourthRequest(
  url: string,
  browser: string,
  session: string,
  aws: string,
): Promise<FourthResponse> {
  const cookies = `${browser}; ${session}; ${aws}`;
  const response = await fetch(url, {
    headers: {
      Cookie: cookies,
    },
    redirect: 'manual',
  });

  return {
    location: response.headers.get('location') || '',
    cookies: {
      AWSELBAuthSessionCookie: response.headers
        .getSetCookie()![0]
        .split(';')[0],
    },
  };
}

interface FifthResponse {
  cookies: {
    XSRF_TOKEN: string;
    personio_session: string;
  };
}

async function fifthRequest(
  browser: string,
  session: string,
  aws: string,
): Promise<FifthResponse> {
  return new Promise((resolve, reject) => {
    const cookies = `${browser}; ${session}; ${aws}`;

    const options = {
      hostname: 'rindus.personio.de',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
    };

    const req = https.request(options, (res) => {
      resolve({
        cookies: {
          XSRF_TOKEN: res.headers['set-cookie']![0].split(';')[0],
          personio_session: res.headers['set-cookie']![1].split(';')[0],
        },
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function sixthRequest(
  browser: string,
  session: string,
  xsrf: string,
  aws1: string,
  aws2: string,
): Promise<[]> {
  const cookies = `${browser}; ${session}; ${xsrf}; ${aws1}; ${aws2}`;
  const xsrfToken = xsrf.split('=')[1].trim();

  const response = await fetch(
    'https://rindus.personio.de/staff/employee-list/bff/data',
    {
      headers: {
        Cookie: cookies,
        'x-xsrf-token': xsrfToken,
        'x-csrf-token': xsrfToken,
        'content-type': 'application/json',
      },
      body: `{"query": "%7B%22columns%22%3A%5B%22preferred_name%22%2C%22status%22%2C%22email%22%2C%22office_id%22%2C%22department_id%22%2C%22team_id%22%2C%22position%22%2C%22first_name%22%2C%22last_name%22%2C%22gender%22%2C%22subcompany_id%22%2C%22termination_date%22%2C%22dynamic_34779%22%2C%22dynamic_87778%22%2C%22dynamic_1298673%22%2C%22dynamic_1300584%22%5D%2C%22filters%22%3A%7B%22status%22%3A%5B%22active%22%5D%7D%2C%22sortBy%22%3A%22preferred_name%22%2C%22sortDirection%22%3A%22asc%22%2C%22page%22%3A1%2C%22perPage%22%3A0%2C%22search%22%3A%22%22%2C%22searchMode%22%3A%22simplified%22%2C%22isOffboarding%22%3Afalse%2C%22isOnboarding%22%3Afalse%7D"}`,
      method: 'POST',
    },
  );

  const data = await response.json();

  return data.data.items;
}
