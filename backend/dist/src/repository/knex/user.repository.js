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
exports.KnexUserRepository = void 0;
const UserRecord_converter_1 = require("../../converters/service/UserRecord.converter");
const Pagination_converter_1 = require("../../converters/service/Pagination.converter");
class KnexUserRepository {
    constructor(knex) {
        this.knex = knex;
        this.userConverter = new UserRecord_converter_1.UserConverter();
        this.userPageConverter = new Pagination_converter_1.PageConverter(this.userConverter);
        this.loggedInConverter = new UserRecord_converter_1.LoggedInUserConverter();
        this.userWithInfoConverter = new UserRecord_converter_1.UserWithInfoConverter();
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRecords = yield this.knex('users');
            return this.mapToBusinesss(userRecords);
        });
    }
    page(page, pageSize = KnexUserRepository.PAGE_SIZE) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryUserRecords = this.knex('users')
                .offset((page - 1) * pageSize)
                .limit(pageSize);
            const queryTotalRecords = this.knex('users')
                .count()
                .first();
            const [userRecords, totalRecords] = yield Promise.all([
                queryUserRecords,
                queryTotalRecords,
            ]);
            return this.userPageConverter.convert([
                userRecords,
                this.totalPages(totalRecords),
            ]);
        });
    }
    mapToBusinesss(userRecords) {
        return userRecords.map((record) => this.userConverter.convert(record));
    }
    totalPages(maybeTotalRecords) {
        if (maybeTotalRecords) {
            return Math.ceil(maybeTotalRecords.count / KnexUserRepository.PAGE_SIZE);
        }
        return 0;
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const maybeRecord = yield this.selectLoggedInUserRecord()
                .where('email', email)
                .first();
            return this.toLoggedInUser(maybeRecord);
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const maybeRecord = yield this.selectLoggedInUserRecord()
                .where('id', id)
                .first();
            return this.toLoggedInUser(maybeRecord);
        });
    }
    selectLoggedInUserRecord() {
        return this.knex('users').select('id', 'picture_url');
    }
    toLoggedInUser(record) {
        return record ? this.loggedInConverter.convert(record) : undefined;
    }
    findUserWithInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [maybeUserWithInfo, userLanguages] = yield Promise.all([
                this.userWithInfo(id),
                this.userLanguages(id),
            ]);
            if (maybeUserWithInfo) {
                return Object.assign(Object.assign({}, maybeUserWithInfo), { languages: userLanguages });
            }
            return undefined;
        });
    }
    userWithInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const maybeRecord = yield this.knex({
                u: 'users',
            })
                .leftJoin({ p: 'partners' }, 'u.partner_id', 'p.id')
                .leftJoin({ o: 'offices' }, 'u.office_id', 'o.id')
                .select({ id: 'u.id' }, 'first_name', 'last_name', 'email', { office_name: 'o.name' }, { partner_name: 'p.name' }, 'position', 'picture_url')
                .where('u.id', id)
                .first();
            return maybeRecord
                ? this.userWithInfoConverter.convert(maybeRecord)
                : undefined;
        });
    }
    userLanguages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const languageRecords = yield this.knex({ ul: 'users_languages' })
                .join({ l: 'languages' }, 'ul.language_id', 'l.id')
                .select('l.name')
                .where('ul.user_id', userId);
            return languageRecords.map((record) => record.name);
        });
    }
}
exports.KnexUserRepository = KnexUserRepository;
KnexUserRepository.PAGE_SIZE = 18;
