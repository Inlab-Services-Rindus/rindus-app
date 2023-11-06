"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../bootstrap/database");
const user_repository_1 = require("../../repository/knex/user.repository");
describe.skip('KnexUserRepository', () => {
    let userRepository;
    const findableUserEmail = 'test@email.com';
    const findableUser = {
        id: 2,
        email: findableUserEmail,
        first_name: 'Found',
        last_name: 'User',
        profile_picture_url: 'url',
    };
    const allUserRecords = [
        {
            id: 1,
            email: 'one@email.com',
            first_name: 'Foo',
            last_name: 'Bar',
        },
        findableUser,
    ];
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const knex = (0, database_1.connectTestDatabase)();
        yield knex('users').insert(allUserRecords);
        userRepository = new user_repository_1.KnexUserRepository(knex);
    }));
    describe('findUser', () => {
        it('should find user by email', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userRepository.findUserByEmail(findableUserEmail);
            expect(user).toEqual({
                id: findableUser.id.toFixed(),
                firstName: findableUser.first_name,
                lastName: findableUser.last_name,
                email: findableUser.email,
                profilePictureUrl: findableUser.profile_picture_url,
            });
        }));
        it('should return undefined if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userRepository.findUserByEmail('foo');
            expect(user).toEqual(undefined);
        }));
    });
    describe('all', () => {
        it('should return all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield userRepository.all();
            expect(users).toHaveLength(2);
        }));
        it('should return empty array if no users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, database_1.connectTestDatabase)()('users').truncate();
            const users = yield userRepository.all();
            expect(users).toEqual([]);
        }));
    });
});
