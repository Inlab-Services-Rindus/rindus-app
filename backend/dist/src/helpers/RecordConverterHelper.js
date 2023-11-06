"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.distinctRecords = exports.toRecordId = void 0;
const toRecordId = (id) => {
    const number = Number(id);
    return isNaN(number) ? undefined : number;
};
exports.toRecordId = toRecordId;
function distinctRecords(items) {
    return distinct(items).map(toRecord);
}
exports.distinctRecords = distinctRecords;
function isEmpty(string) {
    return string.trim().length === 0;
}
exports.isEmpty = isEmpty;
function distinct(items) {
    return [...new Set(items)];
}
function toRecord(elem) {
    return { name: elem };
}
