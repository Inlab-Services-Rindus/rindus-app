import { Converter } from '@/converters/Converter';
import {
  User as BusinessUser,
  WithInfo,
  WithLanguages,
} from '@/models/business/User';
import { User as ApiUser } from '@/models/api/User';
import { Department, UserProfile } from '@/models/api/users/Show';
import { UserResult } from '@/models/api/search/Search';
import { Page } from '@/models/business/Pagination';
import { UsersIndexPage } from '@/models/api/users/Index';
import { LoggedInUserConverter } from '@/converters/api/Session.converter';
import { Partner } from '@/models/business/Partner';
import { config } from '@/config';

export class UserConverter implements Converter<BusinessUser, ApiUser> {
  private readonly userLoginConverter: LoggedInUserConverter;

  constructor() {
    this.userLoginConverter = new LoggedInUserConverter();
  }

  convert(source: BusinessUser): ApiUser {
    return {
      ...this.userLoginConverter.convert(source),
      email: source.email,
      firstName: source.firstName,
      lastName: source.lastName,
      isBirthday: source.isBirthday,
    };
  }
}

export class ShowUserConverter
  implements Converter<BusinessUser & WithInfo & WithLanguages, UserProfile>
{
  private readonly userConverter: UserConverter;
  private readonly departmentConverter: DeparmentConverter;

  constructor() {
    this.userConverter = new UserConverter();
    this.departmentConverter = new DeparmentConverter();
  }

  convert(source: BusinessUser & WithInfo & WithLanguages): UserProfile {
    return {
      ...this.userConverter.convert(source),
      position: source.position,
      office: source.office,
      department: this.departmentConverter.convert(source.partner),
      languages: source.languages.map((language) => language.name),
      slack: { name: source.slack.name, profileUrl: source.slack.profileUrl },
    };
  }
}

export class DeparmentConverter
  implements Converter<Partner | undefined, Department>
{
  convert(source: Partner | undefined): Department {
    if (source) {
      return { id: source.id, name: source.name, logoUrl: source.logoUrl };
    }

    return {
      id: null,
      name: 'rindus',
      logoUrl: `${config.app.url}/images/rindus.jpg`,
    };
  }
}

export class UserResultConverter
  implements Converter<BusinessUser, UserResult>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: BusinessUser): UserResult {
    return {
      ...this.userConverter.convert(source),
      position: source.position,
    };
  }
}

export class UsersIndexConverter
  implements Converter<Page<BusinessUser>, UsersIndexPage>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: Page<BusinessUser>): UsersIndexPage {
    return {
      data: source.data.map((user) => this.userConverter.convert(user)),
      totalPages: source.totalPages,
    };
  }
}
