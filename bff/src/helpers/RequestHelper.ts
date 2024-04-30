import { isEmpty } from '@/helpers/RecordConverterHelper';
import { KnexUserRepository } from '@/repository/knex/user.repository';
import { Request } from 'express';

export function parsePageQueryParam(request: Request): number {
  return (
    parseNumberQueryParam(request, 'page') || KnexUserRepository.DEFAULT_PAGE
  );
}

export function parsePageSizeQueryParam(request: Request): number {
  const requestedPageSize =
    parseNumberQueryParam(request, 'pageSize') || KnexUserRepository.PAGE_SIZE;
  return requestedPageSize > 100 ? 100 : requestedPageSize;
}

export function parseIdQueryParam(request: Request): number | undefined {
  return parseNumberQueryParam(request, 'id');
}

export function parseQueryQueryParam(request: Request): string | undefined {
  return parseStringQueryParam(request, 'query');
}

export function parseKeywordQueryParam(request: Request): string | undefined {
  return parseStringQueryParam(request, 'keyword');
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

function parseStringQueryParam(
  request: Request,
  param: string,
): string | undefined {
  const queryStringParam = request.query[param];

  if (typeof queryStringParam === 'string' && !isEmpty(queryStringParam)) {
    return queryStringParam;
  }

  return undefined;
}
