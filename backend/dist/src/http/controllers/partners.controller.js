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
exports.PartnersController = void 0;
const Partner_converter_1 = require("../../converters/api/Partner.converter");
class PartnersController {
    constructor(partnerRepository) {
        this.partnerRepository = partnerRepository;
        this.partnersIndexConverter = new Partner_converter_1.PartnersIndexConverter();
    }
    index(_request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const partners = yield this.partnerRepository.all();
            const index = this.partnersIndexConverter.convert(partners);
            return response.send(index);
        });
    }
}
exports.PartnersController = PartnersController;
