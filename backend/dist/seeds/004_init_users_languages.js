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
exports.seed = void 0;
const helper_1 = require("./helper");
const Personio_converter_1 = require("../src/converters/service/seeds/Personio.converter");
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex('users_languages').del();
        const personioData = (0, helper_1.parsePersonioJSONFile)();
        const languagesConverter = new Personio_converter_1.EmployeeLanguagesConverter();
        const processEmployeeLanguages = employeeLanguagesProcessor(knex, languagesConverter);
        const employeesLanguages = yield Promise.all(personioData.data.items
            .map((employeeData) => employeeData.data)
            .map((employee) => __awaiter(this, void 0, void 0, function* () { return yield processEmployeeLanguages(employee); })));
        yield knex('users_languages').insert(employeesLanguages.flat());
    });
}
exports.seed = seed;
const employeeLanguagesProcessor = (knex, converter) => (personioEmployee) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield findUserId(knex, personioEmployee.email);
    const languages = converter.convert(personioEmployee);
    return processLanguages(knex, userId, languages);
});
function findUserId(knex, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const maybeUser = yield knex('users').where('email', email).first();
        return maybeUser ? maybeUser.id : 0;
    });
}
function processLanguages(knex, userId, languages) {
    return __awaiter(this, void 0, void 0, function* () {
        return languages.reduce((acc, lang) => __awaiter(this, void 0, void 0, function* () {
            const maybeLanguage = yield knex('languages').where('name', lang).first();
            const accumulator = yield acc;
            return maybeLanguage
                ? accumulator.concat({ user_id: userId, language_id: maybeLanguage.id })
                : accumulator;
        }), Promise.resolve([]));
    });
}
