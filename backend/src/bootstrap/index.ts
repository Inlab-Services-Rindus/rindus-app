import express from 'express';

import { connectDatabase } from '@/bootstrap/database';
import { configure } from '@/bootstrap/configure';
import { initFuse } from '@/bootstrap/search';

import { KnexUserRepository } from '@/repository/knex/user.repository';
import { KnexPartnerRepository } from '@/repository/knex/partner.repository';

import { GoogleJwtValidator } from '@/services/jwt-validator/google';
import { FuseUserSearch } from '@/services/search/fuse';

import { SessionPrograms } from '@/programs/session.programs';
import { UserPrograms } from '@/programs/user.programs';

import { SessionController } from '@/http/controllers/session.controller';
import { UsersController } from '@/http/controllers/users.controller';
import { PartnersController } from '@/http/controllers/partners.controller';
import { SearchController } from '@/http/controllers/search.controller';

const store = connectDatabase();
const expressApp = express();

// Repositories
const userRepository = new KnexUserRepository(store);
const partnerRepository = new KnexPartnerRepository(store);

const fuse = initFuse(userRepository);

// Services
const jwtValidator = new GoogleJwtValidator();
const userSearchService = new FuseUserSearch(fuse);

// Programs
const sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
const userPrograms = new UserPrograms(userRepository);

// Controllers
export const sessionController = new SessionController(
  sessionPrograms,
  userRepository,
);
export const usersController = new UsersController(userPrograms);
export const partnersController = new PartnersController(partnerRepository);
export const searchController = new SearchController(userSearchService);

export const app = configure(expressApp, store);
