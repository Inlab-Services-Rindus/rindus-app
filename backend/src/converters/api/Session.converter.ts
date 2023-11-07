import { Converter } from '@/converters/Converter';
import { LoggedInUser } from '@/models/business/User';
import { MinimalUser as ApiLoggedInUser } from '@/models/api/User';

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
