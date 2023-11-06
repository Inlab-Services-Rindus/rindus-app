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
exports.KnexPartnerRepository = void 0;
const PartnerRecord_converter_1 = require("../../converters/service/PartnerRecord.converter");
class KnexPartnerRepository {
    constructor(knex) {
        this.knex = knex;
        this.partnerConverter = new PartnerRecord_converter_1.PartnerRecordConverter();
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const partnerRecords = yield this.knex('partners').select('id', 'name', 'logo_url');
            return partnerRecords.map((record) => this.partnerConverter.convert(record));
        });
    }
}
exports.KnexPartnerRepository = KnexPartnerRepository;
