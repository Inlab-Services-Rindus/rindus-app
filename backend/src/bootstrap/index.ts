import express from 'express';

import { connectDatabase } from '@/bootstrap/database';
import { configure } from '@/bootstrap/configure';

import { KnexUserRepository } from '@/repository/knex/user.repository';
import { KnexPartnerRepository } from '@/repository/knex/partner.repository';

import { GoogleJwtValidator } from '@/services/jwt-validator/google';

import { SessionPrograms } from '@/programs/session.programs';
import { UserPrograms } from '@/programs/user.programs';
import { PartnerPrograms } from '@/programs/partner.programs';

import { SessionController } from '@/controllers/session.controller';
import { UsersController } from '@/controllers/users.controller';
import { PartnersController } from '@/controllers/partners.controller';

const store = connectDatabase();
const expressApp = express();

// Repositories
const userRepository = new KnexUserRepository(store);
const partnerRepository = new KnexPartnerRepository(store);

// Services
const jwtValidator = new GoogleJwtValidator();

// Programs
const sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
const userPrograms = new UserPrograms(userRepository);
const partnerPrograms = new PartnerPrograms(partnerRepository);

// Controllers
export const sessionController = new SessionController(sessionPrograms);
export const usersController = new UsersController(userPrograms);
export const partnersController = new PartnersController(partnerPrograms);

export const app = configure(expressApp, store);
