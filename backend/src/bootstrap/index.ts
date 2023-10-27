import express from 'express';

import { connectDatabase } from '@/bootstrap/database';
import { configure } from '@/bootstrap/configure';

import { KnexUserRepository } from '@/repository/knex/user.repository';
import { KnexPartnerRepository } from '@/repository/knex/partner.repository';
import { KnexLanguageRepository } from '@/repository/knex/language.repository';

import { GoogleJwtValidator } from '@/services/jwt-validator/google';

import { SessionPrograms } from '@/programs/session.programs';
import { UserPrograms } from '@/programs/user.programs';

import { SessionController } from '@/controllers/session.controller';
import { UsersController } from '@/controllers/users.controller';
import { PartnersController } from '@/controllers/partners.controller';

const store = connectDatabase();
const expressApp = express();

// Repositories
const userRepository = new KnexUserRepository(store);
const partnerRepository = new KnexPartnerRepository(store);
const languageRepository = new KnexLanguageRepository(store);

// Services
const jwtValidator = new GoogleJwtValidator();

// Programs
const sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
const userPrograms = new UserPrograms(userRepository, languageRepository);

// Controllers
export const sessionController = new SessionController(
  sessionPrograms,
  userRepository,
);
export const usersController = new UsersController(userPrograms);
export const partnersController = new PartnersController(partnerRepository);

export const app = configure(expressApp, store);
