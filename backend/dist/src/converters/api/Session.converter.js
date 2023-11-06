"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedInUserConverter = void 0;
class LoggedInUserConverter {
    convert(source) {
        return {
            id: source.id,
            profilePictureUrl: source.pictureUrl,
        };
    }
}
exports.LoggedInUserConverter = LoggedInUserConverter;
