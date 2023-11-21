import { config } from '@/config';
import { Converter } from '@/converters/Converter';
import { LoggedInUser, User, WithInfo } from '@/models/business/User';
import {
  LoggedInUserRecord,
  UserProfileQueryRecord,
  UserViewRecord,
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

export class UserViewConverter implements Converter<UserViewRecord, User> {
  private readonly loggedInUserConverter: LoggedInUserConverter;

  constructor() {
    this.loggedInUserConverter = new LoggedInUserConverter();
  }

  convert(source: UserViewRecord): User {
    return {
      ...this.loggedInUserConverter.convert(source),
      firstName: source.first_name,
      lastName: source.last_name,
      email: source.email,
      position: source.position,
      birthday: source.birthday,
      isBirthday: source.is_birthday,
      isTeamCaptain: source.is_team_captain,
    };
  }
}

export class UserWithInfoConverter
  implements Converter<UserProfileQueryRecord, User & WithInfo>
{
  private static readonly SLACK_URL = 'https://rindus.slack.com/team/';
  private readonly userViewConverter: UserViewConverter;
  private readonly withPartnerRecordRecordConverter: WithPartnerRecordConverter;

  constructor() {
    this.userViewConverter = new UserViewConverter();
    this.withPartnerRecordRecordConverter = new WithPartnerRecordConverter();
  }

  convert(source: UserProfileQueryRecord): User & WithInfo {
    const slackId = source.slack_id;

    return {
      ...this.userViewConverter.convert(source),
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
