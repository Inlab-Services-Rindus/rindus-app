import { Request } from 'express';

export function parsePageQueryParam(request: Request) {
  const queryStringPage = request.query.page;

  if (typeof queryStringPage === 'string') {
    return Number(queryStringPage);
  } else {
    return 1;
  }
}
