import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js';

import { UserRepository } from '@/repository/user.repository';
import { User } from '@/models/business/User';
import { LanguageRepository } from '@/repository/language.repository';
import { Language } from '@/models/business/Language';

export async function initUsersFuseByName(userRepository: UserRepository) {
  return initUsersFuse(userRepository, ['firstName', 'lastName']);
}

export async function initUsersFuseByPosition(userRepository: UserRepository) {
  return initUsersFuse(userRepository, ['position']);
}

export async function initLanguagesFuse(
  languageRepository: LanguageRepository,
) {
  const options: IFuseOptions<Language> = {
    isCaseSensitive: false,
    keys: ['name'],
    minMatchCharLength: 3,
  };

  const languages = await languageRepository.all();

  return new Fuse(languages, options);
}

async function initUsersFuse(
  userRepository: UserRepository,
  keys: FuseOptionKey<User>[],
) {
  const options: IFuseOptions<User> = {
    isCaseSensitive: false,
    minMatchCharLength: 3,
    keys,
  };

  const users = await userRepository.all();

  return new Fuse(users, options);
}
