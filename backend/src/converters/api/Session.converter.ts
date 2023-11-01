import { Converter } from '@/converters/Converter';
import { LoggedInUser } from '@/models/business/User';
import { LoggedInUser as ApiLoggedInUser } from '@/models/api/LoggedInUser';

export class LoggedInUserConverter
  implements Converter<LoggedInUser, ApiLoggedInUser>
{
  convert(source: LoggedInUser): ApiLoggedInUser {
    return {
      id: source.id,
      profilePictureUrl: source.pictureUrl,
    };
  }
}
