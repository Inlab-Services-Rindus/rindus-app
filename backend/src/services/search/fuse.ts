import Fuse from 'fuse.js';
import { User } from '@/models/business/User';
import { UserSearch } from '@/services/search';
import { logger } from '@/bootstrap/logger';

export class FuseUserSearch implements UserSearch {
  private readonly fuse: Promise<Fuse<User>>;

  constructor(fuse: Promise<Fuse<User>>) {
    this.fuse = fuse;
  }

  async search(query: string): Promise<User[]> {
    return (await this.fuse)
      .search(query)
      .map((result) => {
        logger.debug(result);
        return result;
      })
      .map((result) => result.item);
  }
}
