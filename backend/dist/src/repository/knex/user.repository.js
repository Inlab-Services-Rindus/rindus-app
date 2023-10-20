"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexUserRepository = void 0;
class KnexUserRepository {
    constructor(knex) {
        this.knex = knex;
    }
    findUser(email) {
        return this.knex('users')
            .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
            .where('email', email)
            .first()
            .then((userRecord) => userRecord ? this.recordToUser(userRecord) : undefined);
    }
    all() {
        return this.knex('users')
            .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
            .then((userRecords) => userRecords.map((record) => this.recordToUser(record)));
    }
    recordToUser(userRecord) {
        return {
            id: userRecord.id.toFixed(),
            firstName: userRecord.first_name,
            lastName: userRecord.last_name,
            email: userRecord.email,
            profilePictureUrl: this.mapAvatarUrl(userRecord.profile_picture_url),
        };
    }
    mapAvatarUrl(personioUrl) {
        const personioImageServer = 'https://images.personio.de/';
        if (personioUrl && personioUrl.includes(personioImageServer)) {
            return personioUrl
                .replace(personioImageServer, '/avatars/')
                .replace('small', 'large');
        }
        else {
            return personioUrl;
        }
    }
}
exports.KnexUserRepository = KnexUserRepository;
