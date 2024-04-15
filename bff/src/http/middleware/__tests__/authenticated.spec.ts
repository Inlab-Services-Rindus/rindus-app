import { Request, Response } from 'express';

import { authenticated } from '@/http/middleware/authenticated';

describe('authenticated', () => {
  it('should forward request if session contains userId', () => {
    const authenticatedRequest = {
      session: {
        userId: 'foo',
      },
    } as unknown as Request;
    const response = {} as Response;
    const nextSpy = jest.fn();

    authenticated(authenticatedRequest, response, nextSpy);

    expect(nextSpy).toBeCalled();
  });

  it('should not forward request if session does not contain userId and return 401', () => {
    const request = {
      session: {
        userId: undefined,
      },
    } as Request;
    const nextSpy = jest.fn();
    const sendStatusSpy = jest.fn();
    const response = { sendStatus: sendStatusSpy } as unknown as Response;

    authenticated(request, response, nextSpy);

    expect(nextSpy).not.toBeCalled();
    expect(sendStatusSpy).toHaveBeenCalledWith(401);
  });
});
