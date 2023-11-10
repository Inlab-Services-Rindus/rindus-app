import { KnexUserRepository } from '@/repository/knex/user.repository';
import { Request } from 'express';

export function parsePageQueryParam(request: Request) {
  return (
    parseNumberQueryParam(request, 'page') || KnexUserRepository.DEFAULT_PAGE
  );
}

export function parsePageSizeQueryParam(request: Request) {
  const requestedPageSize =
    parseNumberQueryParam(request, 'pageSize') || KnexUserRepository.PAGE_SIZE;
  return requestedPageSize > 100 ? 100 : requestedPageSize;
}

function parseNumberQueryParam(
  request: Request,
  param: string,
): number | undefined {
  const queryStringPage = request.query[param];

  if (typeof queryStringPage === 'string') {
    const maybeNumber = Number(queryStringPage);

    if (!isNaN(maybeNumber)) {
      return maybeNumber;
    }
  }

  return undefined;
}
