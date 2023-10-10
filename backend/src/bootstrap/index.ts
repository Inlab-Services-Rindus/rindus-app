import express from 'express';

import { connectDatabase } from '@/bootstrap/database';
import { configure } from '@/bootstrap/configure';

import { KnexUserRepository } from '@/repository/knex/user';

import { GoogleJwtValidator } from '@/services/jwt-validator/google';

import { SessionPrograms } from '@/programs/session';
import { UserPrograms } from '@/programs/user';

import { SessionController } from '@/controllers/session.controller';
import { UsersController } from '@/controllers/users.controller';

const store = connectDatabase();
const expressApp = express();

// Repositories
const userRepository = new KnexUserRepository(store);

// Services
const jwtValidator = new GoogleJwtValidator();

// Programs
const sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
const userPrograms = new UserPrograms(userRepository);

// Controllers
export const sessionController = new SessionController(sessionPrograms);
export const usersController = new UsersController(userPrograms);

export const app = configure(expressApp, store);
