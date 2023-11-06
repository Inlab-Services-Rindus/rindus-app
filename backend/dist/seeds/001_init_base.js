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
const RecordConverterHelper_1 = require("../src/helpers/RecordConverterHelper");
const Personio_converter_1 = require("../src/converters/service/seeds/Personio.converter");
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex('languages').del();
        yield knex('offices').del();
        yield knex('partners').del();
        const personioData = (0, helper_1.parsePersonioJSONFile)();
        const languagesConverter = new Personio_converter_1.EmployeeLanguagesConverter();
        const items = personioData.data.items;
        const offices = (0, RecordConverterHelper_1.distinctRecords)(items.map((employeeData) => employeeData.data.office_id));
        const languages = (0, RecordConverterHelper_1.distinctRecords)(items.reduce((acc, employeeData) => {
            const employeeLanguages = languagesConverter.convert(employeeData.data);
            return acc.concat(employeeLanguages);
        }, []));
        yield knex('languages').insert(languages);
        yield knex('offices').insert(offices);
    });
}
exports.seed = seed;
