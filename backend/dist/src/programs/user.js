"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrograms = void 0;
class UserPrograms {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    index() {
        return this.userRepository.all();
    }
}
exports.UserPrograms = UserPrograms;
