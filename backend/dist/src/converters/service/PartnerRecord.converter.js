"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerRecordConverter = void 0;
const config_1 = require("../../config");
class PartnerRecordConverter {
    convert(source) {
        return {
            id: source.id,
            name: source.name,
            logoUrl: `${config_1.config.app.url}${source.logo_url}`,
        };
    }
}
exports.PartnerRecordConverter = PartnerRecordConverter;
