"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonioEmployeePartnerConverter = exports.EmployeeLanguagesConverter = exports.PersonioEmployeeConverter = void 0;
const RecordConverterHelper_1 = require("../../../helpers/RecordConverterHelper");
class PersonioEmployeeConverter {
    convert(source) {
        const birthday = source.dynamic_87778;
        return (references) => (Object.assign({ first_name: source.first_name, last_name: source.last_name, email: source.email, picture_url: source.profile_picture_url, birthday: (0, RecordConverterHelper_1.isEmpty)(birthday) ? undefined : birthday, position: source.position }, references));
    }
}
exports.PersonioEmployeeConverter = PersonioEmployeeConverter;
class EmployeeLanguagesConverter {
    convert(source) {
        const rawLanguages = source.dynamic_1300584;
        const sanitisedLanguages = rawLanguages
            .toLowerCase()
            .replace(/,/g, ' ')
            .replace(/\./g, ' ');
        return sanitisedLanguages
            .split(/[ ]+/g)
            .map((lang) => lang.trim())
            .filter((lang) => !(0, RecordConverterHelper_1.isEmpty)(lang));
    }
}
exports.EmployeeLanguagesConverter = EmployeeLanguagesConverter;
class PersonioEmployeePartnerConverter {
    convert(source) {
        if (!this.isPartner(source)) {
            return undefined;
        }
        const partnerName = this.sanitiseDepartmentId(source).trim();
        return {
            name: partnerName,
            logo_url: this.partnerLogoUrl(partnerName),
        };
    }
    sanitiseDepartmentId(departmentId) {
        return departmentId.replace(`${PersonioEmployeePartnerConverter.IT_PREFIX} `, '');
    }
    partnerLogoUrl(partnerName) {
        const sanitisedPartnerName = partnerName
            .toLocaleLowerCase()
            .replace(/ /g, '-')
            .replace(/ö/g, 'o')
            .replace(/&/g, 'and')
            .replace(/loyalty-partner-solutions/g, 'lps');
        return `/images/partners/${sanitisedPartnerName}.svg`;
    }
    isPartner(departmentId) {
        return departmentId.startsWith(PersonioEmployeePartnerConverter.IT_PREFIX);
    }
}
exports.PersonioEmployeePartnerConverter = PersonioEmployeePartnerConverter;
PersonioEmployeePartnerConverter.IT_PREFIX = 'IT';
