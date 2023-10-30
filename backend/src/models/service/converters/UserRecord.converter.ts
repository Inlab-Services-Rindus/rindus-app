import { config } from '@/config';
import { isBirthday } from '@/helpers/WithBirthdayHelper';
import { Converter } from '@/models/Converter';
import { LoggedInUser, User, WithInfo } from '@/models/business/User';
import {
  LoggedInUserRecord,
  UserRecord,
  WithOffice,
  WithPartner,
} from '@/models/service/UserRecord';

export class LoggedInUserConverter
  implements Converter<LoggedInUserRecord, LoggedInUser>
{
  convert(source: LoggedInUserRecord): LoggedInUser {
    return {
      id: source.id,
      pictureUrl: this.mapAvatarUrl(source.picture_url),
    };
  }

  private mapAvatarUrl(picture_url: string | undefined) {
    const pictureUrl = picture_url;
    const personioImageServer = 'https://images.personio.de/';
    const defaultImage = 'https://placehold.co/200?text=Rinder';

    if (!pictureUrl) {
      return defaultImage;
    }

    if (pictureUrl.startsWith(personioImageServer)) {
      return pictureUrl
        .replace(personioImageServer, `${config.app.url}/avatars/`)
        .replace('small', 'large');
    } else {
      return pictureUrl;
    }
  }
}

export class UserConverter implements Converter<UserRecord, User> {
  private readonly loggedInUserConverter: LoggedInUserConverter;

  constructor() {
    this.loggedInUserConverter = new LoggedInUserConverter();
  }

  convert(source: UserRecord): User {
    const fullName =
      source.first_name + (source.last_name ? ` ${source.last_name}` : '');
    const birthday = source.birthday;

    return {
      ...this.loggedInUserConverter.convert(source),
      firstName: source.first_name,
      lastName: source.last_name,
      fullName,
      email: source.email,
      position: source.position,
      birthday,
      isBirthday: isBirthday(birthday),
    };
  }
}

export class UserWithInfoConverter
  implements Converter<UserRecord & WithOffice & WithPartner, User & WithInfo>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: UserRecord & WithOffice & WithPartner): User & WithInfo {
    return {
      ...this.userConverter.convert(source),
      office: source.office_name,
      partner: source.partner_name,
    };
  }
}
