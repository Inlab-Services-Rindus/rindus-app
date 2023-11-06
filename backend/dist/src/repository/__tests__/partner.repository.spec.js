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
const partner_repository_1 = require("../../repository/knex/partner.repository");
describe.skip('KnexPartnerRepository', () => {
    let partnerRepository;
    const allPartnerRecords = [
        {
            id: 1,
            name: 'Partner1',
            picture_url: 'picture1',
        },
        {
            id: 2,
            name: 'Partner2',
            picture_url: 'picture2',
        },
    ];
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const knex = (0, database_1.connectTestDatabase)();
        yield knex('partners').insert(allPartnerRecords);
        partnerRepository = new partner_repository_1.KnexPartnerRepository(knex);
    }));
    describe('all', () => {
        it('should return all partners', () => __awaiter(void 0, void 0, void 0, function* () {
            const partners = yield partnerRepository.all();
            expect(partners).toHaveLength(2);
        }));
        it('should return empty array if no partners', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, database_1.connectTestDatabase)()('partners').truncate();
            const partners = yield partnerRepository.all();
            expect(partners).toEqual([]);
        }));
    });
});
