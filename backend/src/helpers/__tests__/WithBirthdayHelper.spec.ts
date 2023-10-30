import { mockUser } from '@/models/__mocks__/business/User';
import {
  isBirthday,
  parseBirthday,
  sortByBirthday,
} from '@/helpers/WithBirthdayHelper';
import { User } from '@/models/business/User';

describe('isBirthday', () => {
  it('should return false if birthday is undefined', () => {
    const birthday = undefined;

    const result = isBirthday(birthday);

    expect(result).toBe(false);
  });

  it('should return false if birthday is not today', () => {
    const birthday = '1990-01-01';

    const result = isBirthday(birthday);

    expect(result).toBe(false);
  });

  it('should return true if birthday is today', () => {
    const OriginalDate = Date;

    class MockedDate extends Date {
      constructor() {
        super('2023-01-01T00:00:00Z'); // January 1, 2023
      }

      public toLocaleString() {
        return this.toString();
      }
    }

    global.Date = MockedDate as unknown as DateConstructor;

    const birthday = 'Jan 1';
    const result = isBirthday(birthday);

    expect(result).toBe(true);

    global.Date = OriginalDate;
  });
});
describe('parseBirthday', () => {
  it('should return undefined if birthday is undefined', () => {
    const birthday = undefined;

    const result = parseBirthday(birthday);

    expect(result).toBeUndefined();
  });

  it('should return a Date object if birthday is defined', () => {
    const birthday = 'Jan 1';

    const result = parseBirthday(birthday);

    expect(result).toBeInstanceOf(Date);
  });

  it('should return the correct date for a given birthday', () => {
    const birthday = 'Jan 1';

    const result = parseBirthday(birthday);

    expect(result?.getFullYear()).toBe(2023);
    expect(result?.getMonth()).toBe(0);
    expect(result?.getDate()).toBe(1);
  });
});
describe('sortByBirthday', () => {
  it('should sort users by birthday in ascending order', () => {
    const users = [
      { ...mockUser, birthday: new Date(2023, 2, 1) },
      { ...mockUser, birthday: new Date(2023, 1, 1) },
      { ...mockUser, birthday: new Date(2023, 3, 1) },
    ];

    const sortedUsers = sortByBirthday(users);

    expect(sortedUsers).toEqual([
      { ...mockUser, birthday: new Date(2023, 1, 1) },
      { ...mockUser, birthday: new Date(2023, 2, 1) },
      { ...mockUser, birthday: new Date(2023, 3, 1) },
    ]);
  });

  it('should handle users with missing birthdays and put them at the end of the array', () => {
    const users = [
      { ...mockUser, birthday: undefined },
      { ...mockUser, birthday: new Date(2023, 1, 1) },
      { ...mockUser, birthday: new Date(2023, 3, 1) },
    ];

    const sortedUsers = sortByBirthday(users);

    expect(sortedUsers).toEqual([
      { ...mockUser, birthday: new Date(2023, 1, 1) },
      { ...mockUser, birthday: new Date(2023, 3, 1) },
      { ...mockUser, birthday: undefined },
    ]);
  });

  it('should handle empty input', () => {
    const users: User[] = [];

    const sortedUsers = sortByBirthday(users);

    expect(sortedUsers).toEqual([]);
  });
});
