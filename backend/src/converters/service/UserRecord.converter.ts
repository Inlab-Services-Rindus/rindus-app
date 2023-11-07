import { config } from '@/config';
import { isBirthday } from '@/helpers/WithBirthdayHelper';
import { Converter } from '@/converters/Converter';
import { LoggedInUser, User, WithInfo } from '@/models/business/User';
import {
  LoggedInUserRecord,
  UserProfileQueryRecord,
  UserRecord,
} from '@/models/service/database/UserRecord';
import { WithPartnerRecordConverter } from '@/converters/service/PartnerRecord.converter';

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
    const birthday = source.birthday;

    return {
      ...this.loggedInUserConverter.convert(source),
      firstName: source.first_name,
      lastName: source.last_name,
      email: source.email,
      position: source.position,
      birthday,
      isBirthday: isBirthday(birthday),
    };
  }
}

export class UserWithInfoConverter
  implements Converter<UserProfileQueryRecord, User & WithInfo>
{
  private static readonly SLACK_URL = 'https://rindus.slack.com/team/';
  private readonly userConverter: UserConverter;
  private readonly withPartnerRecordRecordConverter: WithPartnerRecordConverter;

  constructor() {
    this.userConverter = new UserConverter();
    this.withPartnerRecordRecordConverter = new WithPartnerRecordConverter();
  }

  convert(source: UserProfileQueryRecord): User & WithInfo {
    const slackId = source.slack_id;

    return {
      ...this.userConverter.convert(source),
      office: source.office_name,
      partner: this.withPartnerRecordRecordConverter.convert({ ...source }),
      slack: {
        name: source.slack_name,
        slackId,
        profileUrl: `${UserWithInfoConverter.SLACK_URL}${slackId}`,
      },
    };
  }
}
