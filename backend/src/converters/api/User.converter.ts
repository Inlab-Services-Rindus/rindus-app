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
import { IndexUser, UsersIndexPage } from '@/models/api/users/Index';
import { LoggedInUserConverter } from '@/converters/api/Session.converter';
import { Partner } from '@/models/business/Partner';

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

export class IndexUserConverter implements Converter<BusinessUser, IndexUser> {
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }
  convert(source: BusinessUser): IndexUser {
    return {
      ...this.userConverter.convert(source),
      isCaptain: source.isTeamCaptain,
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
      slack: source.slack?.name
        ? { name: source.slack.name, profileUrl: source.slack.profileUrl }
        : undefined,
      isCaptain: source.isTeamCaptain,
    };
  }
}

export class DeparmentConverter implements Converter<Partner, Department> {
  convert(source: Partner): Department {
    return { id: source.id, name: source.name, logoUrl: source.logoUrl };
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
      isCaptain: source.isTeamCaptain,
    };
  }
}

export class UsersIndexConverter
  implements Converter<Page<BusinessUser>, UsersIndexPage>
{
  private readonly indexUserConverter: IndexUserConverter;

  constructor() {
    this.indexUserConverter = new IndexUserConverter();
  }

  convert(source: Page<BusinessUser>): UsersIndexPage {
    return {
      data: source.data.map((user) => this.indexUserConverter.convert(user)),
      totalPages: source.totalPages,
    };
  }
}
