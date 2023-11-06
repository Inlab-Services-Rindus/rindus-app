"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersIndexConverter = exports.UserResultConverter = exports.ShowUserConverter = void 0;
const Session_converter_1 = require("../../converters/api/Session.converter");
class UserConverter {
    constructor() {
        this.userLoginConverter = new Session_converter_1.LoggedInUserConverter();
    }
    convert(source) {
        return Object.assign(Object.assign({}, this.userLoginConverter.convert(source)), { email: source.email, firstName: source.firstName, lastName: source.lastName, fullName: source.fullName, isBirthday: source.isBirthday });
    }
}
class ShowUserConverter {
    constructor() {
        this.userConverter = new UserConverter();
    }
    convert(source) {
        return Object.assign(Object.assign({}, this.userConverter.convert(source)), { position: source.position, office: source.office, partner: source.partner, languages: source.languages });
    }
}
exports.ShowUserConverter = ShowUserConverter;
class UserResultConverter {
    constructor() {
        this.loggedInUserConverter = new Session_converter_1.LoggedInUserConverter();
    }
    convert(source) {
        return Object.assign(Object.assign({}, this.loggedInUserConverter.convert(source)), { fullName: source.fullName, position: source.position, isBirthday: source.isBirthday });
    }
}
exports.UserResultConverter = UserResultConverter;
class UsersIndexConverter {
    constructor() {
        this.userConverter = new UserConverter();
    }
    convert(source) {
        return {
            data: source.data.map((user) => this.userConverter.convert(user)),
            totalPages: source.totalPages,
        };
    }
}
exports.UsersIndexConverter = UsersIndexConverter;
