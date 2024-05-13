import { FuseSearchService } from '@/services/search/fuse';
import { Request, Response } from 'express';

export class AdminController {
  private readonly userSearchService;

  constructor(userSearchService: FuseSearchService) {
    this.userSearchService = userSearchService;
  }

  public async index(_request: Request, response: Response) {
    let success = true;
    await this.userSearchService.index().catch(() => (success = false));

    if (success) {
      return response.sendStatus(200);
    } else {
      return response.sendStatus(409);
    }
  }
}
