import Fuse, { IFuseOptions } from 'fuse.js';

import { UserRepository } from '@/repository/user.repository';
import { User } from '@/models/business/User';

export async function initFuse(userRepository: UserRepository) {
  const options: IFuseOptions<User> = {
    isCaseSensitive: false,
    keys: ['firstName', 'lastName'],
    minMatchCharLength: 2,
  };

  const users = await userRepository.all();

  return new Fuse(users, options);
}
