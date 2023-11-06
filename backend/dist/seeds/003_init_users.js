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
        yield knex('users').del();
        const personioData = (0, helper_1.parsePersonioJSONFile)();
        const converter = new Personio_converter_1.PersonioEmployeeConverter();
        const partnerConverter = new Personio_converter_1.PersonioEmployeePartnerConverter();
        const processEmployeeBaseData = employeeBaseDataProcessor(knex, converter, partnerConverter);
        const employees = yield Promise.all(personioData.data.items
            .map((employeeData) => employeeData.data)
            .map((employee) => __awaiter(this, void 0, void 0, function* () { return yield processEmployeeBaseData(employee); })));
        yield knex('users').insert(employees);
    });
}
exports.seed = seed;
const employeeBaseDataProcessor = (knex, converter, partnerConverter) => (personioEmployee) => __awaiter(void 0, void 0, void 0, function* () {
    const [officeId, partnerId] = yield Promise.all([
        processOffice(knex, personioEmployee.office_id),
        processPartner(knex, partnerConverter, personioEmployee.department_id),
    ]);
    return converter.convert(personioEmployee)({
        office_id: officeId,
        partner_id: partnerId,
    });
});
function processOffice(knex, officeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const maybeOffice = yield knex('offices')
            .where('name', officeId)
            .first();
        return maybeOffice ? maybeOffice.id : 0;
    });
}
function processPartner(knex, partnerConverter, partnerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const maybePartner = yield knex('partners')
            .where('name', partnerConverter.sanitiseDepartmentId(partnerId))
            .first();
        return maybePartner === null || maybePartner === void 0 ? void 0 : maybePartner.id;
    });
}
