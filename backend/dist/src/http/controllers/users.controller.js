"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const RequestHelper_1 = require("../../helpers/RequestHelper");
const RecordConverterHelper_1 = require("../../helpers/RecordConverterHelper");
const User_converter_1 = require("../../converters/api/User.converter");
class UsersController {
    constructor(userPrograms) {
        this.userPrograms = userPrograms;
        this.usersIndexConverter = new User_converter_1.UsersIndexConverter();
        this.showUserConverter = new User_converter_1.ShowUserConverter();
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const mockBirthdays = request.headers[UsersController.MOCK_BIRTHDAYS_HTTP_HEADER.toLowerCase()];
            const page = (0, RequestHelper_1.parsePageQueryParam)(request);
            const users = yield this.userPrograms.index(!!mockBirthdays, page);
            const index = this.usersIndexConverter.convert(users);
            return response.send(index);
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdParam = request.params.userId;
            const maybeUserId = (0, RecordConverterHelper_1.toRecordId)(userIdParam);
            if (maybeUserId) {
                const maybeUser = yield this.userPrograms.show(maybeUserId);
                if (maybeUser) {
                    const user = this.showUserConverter.convert(maybeUser);
                    return response.send(user);
                }
            }
            return response.sendStatus(404);
        });
    }
}
exports.UsersController = UsersController;
UsersController.MOCK_BIRTHDAYS_HTTP_HEADER = 'X-Mock-Birthdays';
