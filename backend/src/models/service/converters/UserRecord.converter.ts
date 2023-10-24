import { fromRecordId } from '@/helpers/RecordConverterHelper';
import { Converter } from '@/models/Converter';
import { User } from '@/models/business/User';
import {
  UserRecord,
  WithOffice,
  WithPartner,
} from '@/models/service/UserRecord';

export class ExtendedUserRecordConverter
  implements Converter<UserRecord & WithOffice & WithPartner, User>
{
  convert(source: UserRecord & WithOffice & WithPartner): User {
    const fullName =
      source.first_name + (source.last_name ? ` ${source.last_name}` : '');

    return {
      id: fromRecordId(source.id),
      firstName: source.first_name,
      lastName: source.last_name,
      fullName,
      email: source.email,
      pictureUrl: this.mapAvatarUrl(source),
      birthday: source.birthday,
      position: source.position,
      partner: source.partner_name,
      office: source.office_name,
    };
  }

  private mapAvatarUrl(source: UserRecord) {
    const pictureUrl = source.picture_url;
    const personioImageServer = 'https://images.personio.de/';
    if (pictureUrl) {
      if (pictureUrl.startsWith(personioImageServer)) {
        return pictureUrl
          .replace(personioImageServer, '/avatars/')
          .replace('small', 'large');
      } else {
        return pictureUrl;
      }
    } else {
      return `https://avatar-service-platform.personio.de/${source.first_name.at(
        0,
      )}`;
    }
  }
}
