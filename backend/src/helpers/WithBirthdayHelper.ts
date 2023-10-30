import { User } from '@/models/business/User';

const months: { [x: string]: number } = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export function parseBirthday(birthday: string | undefined): Date | undefined {
  if (!birthday) {
    return undefined;
  }

  const [month, day] = birthday.split(' ');
  return new Date(2023, months[month], parseInt(day));
}

export function isBirthday(birthday: string | undefined): boolean {
  if (!birthday) {
    return false;
  }

  const today = new Date();
  const birthDate = parseBirthday(birthday);

  return (
    birthDate?.getDate() === today.getDate() &&
    birthDate?.getMonth() === today.getMonth()
  );
}

export function sortByBirthday(users: User[]): User[] {
  return users.sort((a, b) => {
    if (a.birthday && b.birthday) {
      return a.birthday.getTime() - b.birthday.getTime();
    } else if (a.birthday) {
      return -1;
    } else if (b.birthday) {
      return 1;
    }
    return 0;
  });
}
