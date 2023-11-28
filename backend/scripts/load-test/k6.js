import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';
import { sleep, check, group } from 'k6';

const loginTrend = new Trend('login_duration');
const usersTrend = new Trend('users_duration');
const partnersTrend = new Trend('partners_duration');

const apiUrl = 'http://localhost:3000';
// const apiUrl = 'https://api.app.rindus.de';

const jwt = 'CHANGEME';

export const CounterErrors = new Counter('Errors');

export const options = {
  // Key configurations for breakpoint in this section
  executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  stages: [
    { duration: '60s', target: 20000 }, // just slowly ramp-up to a HUGE load
  ],
  thresholds: {
    Errors: ['count<1'],
  },
};

export default function () {
  group('visits users and partners after login', function () {
    // Login
    const loginResponse = http.post(
      `${apiUrl}/login`,
      JSON.stringify({
        jwt,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    check(loginResponse, {
      '/login is status 200': (r) => checkSuccessResponse(r),
    });
    CounterErrors.add(!checkSuccessResponse(loginResponse));

    loginTrend.add(loginResponse.timings.duration);

    const sessionCookie = {
      ['connect.sid']: loginResponse.cookies['connect.sid'][0].value,
    };

    // Users
    const usersResponse = http.request(
      'GET',
      `${apiUrl}/users`,
      {},
      {
        cookies: sessionCookie,
      },
    );

    check(usersResponse, {
      '/users is status 200': (r) => checkSuccessResponse(r),
    });
    CounterErrors.add(!checkSuccessResponse(usersResponse));

    usersTrend.add(usersResponse.timings.duration);

    // Partners
    const partnersResponse = http.request(
      'GET',
      `${apiUrl}/partners`,
      {},
      {
        cookies: sessionCookie,
      },
    );

    check(partnersResponse, {
      '/partners is status 200': (r) => checkSuccessResponse(r),
    });
    CounterErrors.add(!checkSuccessResponse(partnersResponse));

    partnersTrend.add(partnersResponse.timings.duration);
  });

  sleep(1);
}

const checkSuccessResponse = (r) => r.status === 200;
