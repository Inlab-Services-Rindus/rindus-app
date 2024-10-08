import express from 'express';

import { config } from '@/config';
import { connectDatabase } from '@/bootstrap/database';
import { configure } from '@/bootstrap/configure';
import {
  initLanguagesFuse,
  initUsersFuseByName,
  initPositionsFuse,
  initUsersFuseByPosition,
} from '@/bootstrap/search';

import { KnexUserRepository } from '@/repository/knex/user.repository';
import { KnexPartnerRepository } from '@/repository/knex/partner.repository';
import { KnexLanguageRepository } from '@/repository/knex/language.repository';

import { GoogleJwtValidator } from '@/services/jwt-validator/google';
import { FuseSearchService } from '@/services/search/fuse';

import { SessionPrograms } from '@/programs/session.programs';
import { UserPrograms } from '@/programs/user.programs';
import { SearchPrograms } from '@/programs/search.programs';

import { SessionController } from '@/http/controllers/session.controller';
import { UsersController } from '@/http/controllers/users.controller';
import { PartnersController } from '@/http/controllers/partners.controller';
import { SearchController } from '@/http/controllers/search.controller';
import { GoogleRepository } from '@/repository/google.respository';
import { GoogleController } from '@/http/controllers/google.controller';
import { GooglePrograms } from '@/programs/google.programs';
import { run as createEmployees } from '@/cmd/create-employees';
import { AdminController } from '@/http/controllers/admin.controller';
import { PersonioSyncService } from '@/services/personio/personio';
import { AuthService } from '@/services/auth/auth';
import NodeCache from 'node-cache';

const store = connectDatabase();
const expressApp = express();

// Caches
const eventsCache = new NodeCache({
  stdTTL: 900, // 15 min
});

// Repositories
const userRepository = new KnexUserRepository(store);
const partnerRepository = new KnexPartnerRepository(store);
const languageRepository = new KnexLanguageRepository(store);

const googleRepository = new GoogleRepository(userRepository);

const usersByName = initUsersFuseByName(userRepository);
const usersByPosition = initUsersFuseByPosition(userRepository);
const positions = initPositionsFuse(userRepository);
const languages = initLanguagesFuse(languageRepository);

// Services
const jwtValidator = new GoogleJwtValidator();
const userSearchService = new FuseSearchService(
  userRepository,
  languageRepository,
  usersByName,
  usersByPosition,
  positions,
  languages,
);
export const authService = new AuthService(config);
export const personioSyncService = new PersonioSyncService(config, authService);

// Programs
const sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
const userPrograms = new UserPrograms(userRepository);
const searchPrograms = new SearchPrograms(userSearchService, userRepository);

const googlePrograms = new GooglePrograms(googleRepository);

// Controllers
export const sessionController = new SessionController(
  sessionPrograms,
  userRepository,
  eventsCache,
);
export const usersController = new UsersController(userPrograms);
export const partnersController = new PartnersController(partnerRepository);
export const searchController = new SearchController(searchPrograms);
export const adminController = new AdminController(
  userSearchService,
  personioSyncService,
  eventsCache,
);
export const googleController = new GoogleController(
  googlePrograms,
  eventsCache,
);

if (config.environment === 'local') {
  setTimeout(createEmployees(false, userPrograms), 5000);
}

export const app = configure(expressApp, store);
