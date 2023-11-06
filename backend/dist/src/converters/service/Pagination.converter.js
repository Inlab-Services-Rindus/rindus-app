"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageConverter = void 0;
class PageConverter {
    constructor(dataRecordConverter) {
        this.recordConverter = dataRecordConverter;
    }
    convert(source) {
        const [records, totalPages] = source;
        return {
            data: records.map((record) => this.recordConverter.convert(record)),
            totalPages,
        };
    }
}
exports.PageConverter = PageConverter;
