"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnersIndexConverter = void 0;
class PartnersIndexConverter {
    constructor() {
        this.indexPartnerConverter = new IndexPartnerConverter();
    }
    convert(source) {
        return source.map((businessPartner) => this.indexPartnerConverter.convert(businessPartner));
    }
}
exports.PartnersIndexConverter = PartnersIndexConverter;
class IndexPartnerConverter {
    convert(source) {
        return {
            id: source.id,
            name: source.name,
            logoUrl: source.logoUrl,
        };
    }
}
