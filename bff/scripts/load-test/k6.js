import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';
import { check, group } from 'k6';

const loginTrend = new Trend('login_duration');
const usersTrend = new Trend('users_duration');
const partnersTrend = new Trend('partners_duration');

const apiUrl = 'http://localhost:3000';
// const apiUrl = 'https://api.app.rindus.de';

const jwt = 'CHANGEME';

export const CounterErrors = new Counter('Errors');

export const options = {
  scenarios: {
    breakpoint_test: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 100,
      stages: [
        { duration: '30s', target: 200 },
        { duration: '1m', target: 100 },
      ],
    },
  },
  thresholds: {
    Errors: ['count<1'],
    checks: ['rate>0.9'],
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
      '/login has a valid session': (r) => r.cookies['sid'] !== undefined,
    });
    check(loginResponse, {});
    CounterErrors.add(!checkSuccessResponse(loginResponse));

    loginTrend.add(loginResponse.timings.duration);

    const sessionCookie = {
      ['sid']: loginResponse.cookies['sid'][0].value,
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
}

const checkSuccessResponse = (r) => r.status === 200;
