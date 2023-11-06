"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBirthday = void 0;
function isBirthday(birthday) {
    if (!birthday) {
        return false;
    }
    const today = new Date();
    const months = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
    };
    const [monthName, dayString] = birthday.split(' ');
    const birthdayMonth = months[monthName];
    const birthdayDay = Number(dayString);
    return birthdayDay === today.getDay() && birthdayMonth === today.getMonth();
}
exports.isBirthday = isBirthday;
