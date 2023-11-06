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
        yield knex('partners').del();
        const personioData = (0, helper_1.parsePersonioJSONFile)();
        const partnerConverter = new Personio_converter_1.PersonioEmployeePartnerConverter();
        const items = personioData.data.items;
        const partners = (0, RecordConverterHelper_1.distinctRecords)(items.map((employeeData) => employeeData.data.department_id)).reduce((acc, enumerable) => {
            const partnerName = enumerable.name;
            const maybePartner = partnerConverter.convert(partnerName);
            return maybePartner ? acc.concat(maybePartner) : acc;
        }, []);
        yield knex('partners').insert(partners);
    });
}
exports.seed = seed;
