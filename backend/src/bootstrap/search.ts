import Fuse, { IFuseOptions } from 'fuse.js';

import { UserRepository } from '@/repository/user.repository';
import { User } from '@/models/business/User';
import { LanguageRepository } from '@/repository/language.repository';
import { Language } from '@/models/business/Language';

export async function initUsersFuseByName(userRepository: UserRepository) {
  const options: IFuseOptions<User> = searchOptions({
    keys: ['firstName', 'lastName'],
  });

  const users = await userRepository.all();

  return new Fuse(users, options);
}

export async function initPositionsFuse(userRepository: UserRepository) {
  const options: IFuseOptions<string> = searchOptions({ keys: ['position'] });

  const positions = await userRepository.allPositions();

  return new Fuse(positions, options);
}

export async function initLanguagesFuse(
  languageRepository: LanguageRepository,
) {
  const options: IFuseOptions<Language> = searchOptions({ keys: ['name'] });

  const languages = await languageRepository.all();

  return new Fuse(languages, options);
}

function searchOptions<T>(opts: IFuseOptions<T>): IFuseOptions<T> {
  return {
    useExtendedSearch: true,
    isCaseSensitive: false,
    minMatchCharLength: 3,
    ...opts,
  };
}
