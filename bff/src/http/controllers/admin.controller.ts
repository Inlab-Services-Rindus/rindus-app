import { Employee, PersonioSyncService } from '@/services/personio/personio';
import { FuseSearchService } from '@/services/search/fuse';
import { Request, Response } from 'express';

export class AdminController {
  private readonly userSearchService: FuseSearchService;
  private readonly personioSyncService: PersonioSyncService;

  constructor(
    userSearchService: FuseSearchService,
    personioSync: PersonioSyncService,
  ) {
    this.userSearchService = userSearchService;
    this.personioSyncService = personioSync;
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

  public async personioJob(_request: Request, response: Response) {
    let personioData: Employee[] = [];
    try {
      personioData = await this.personioSyncService.getPersonioData();
    } catch (e) {
      return response.status(409).send('Error while scraping personio');
    }
    const result = await this.personioSyncService.sync(personioData);

    return response.send(result);
  }
}
