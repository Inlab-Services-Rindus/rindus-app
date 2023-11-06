"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithInfoConverter = exports.UserConverter = exports.LoggedInUserConverter = void 0;
const config_1 = require("../../config");
const WithBirthdayHelper_1 = require("../../helpers/WithBirthdayHelper");
class LoggedInUserConverter {
    convert(source) {
        return {
            id: source.id,
            pictureUrl: this.mapAvatarUrl(source.picture_url),
        };
    }
    mapAvatarUrl(picture_url) {
        const pictureUrl = picture_url;
        const personioImageServer = 'https://images.personio.de/';
        const defaultImage = 'https://placehold.co/200?text=Rinder';
        if (!pictureUrl) {
            return defaultImage;
        }
        if (pictureUrl.startsWith(personioImageServer)) {
            return pictureUrl
                .replace(personioImageServer, `${config_1.config.app.url}/avatars/`)
                .replace('small', 'large');
        }
        else {
            return pictureUrl;
        }
    }
}
exports.LoggedInUserConverter = LoggedInUserConverter;
class UserConverter {
    constructor() {
        this.loggedInUserConverter = new LoggedInUserConverter();
    }
    convert(source) {
        const fullName = source.first_name + (source.last_name ? ` ${source.last_name}` : '');
        const birthday = source.birthday;
        return Object.assign(Object.assign({}, this.loggedInUserConverter.convert(source)), { firstName: source.first_name, lastName: source.last_name, fullName, email: source.email, position: source.position, birthday, isBirthday: (0, WithBirthdayHelper_1.isBirthday)(birthday) });
    }
}
exports.UserConverter = UserConverter;
class UserWithInfoConverter {
    constructor() {
        this.userConverter = new UserConverter();
    }
    convert(source) {
        return Object.assign(Object.assign({}, this.userConverter.convert(source)), { office: source.office_name, partner: source.partner_name });
    }
}
exports.UserWithInfoConverter = UserWithInfoConverter;
