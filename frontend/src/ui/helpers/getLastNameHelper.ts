const splitLastName = (lastName: string): string[] => lastName.split(' ');
const isStartDe = (part: string): boolean => part.toLowerCase() === 'de';
const isStartLa = (part: string): boolean => part.toLowerCase() === 'la';

export const getMainLastNamePart = (lastNameParts: string[]): string => {
  if (lastNameParts.length === 1) {
    return lastNameParts[0];
  }

  if (isStartDe(lastNameParts[0])) {
    if (isStartLa(lastNameParts[1]) && lastNameParts.length > 2) {
      return `${lastNameParts[0]} ${lastNameParts[1]} ${lastNameParts[2]}`;
    }
    if (lastNameParts.length > 1) {
      return `${lastNameParts[0]} ${lastNameParts[1]}`;
    }
    
  }

  return lastNameParts[0];
};

export const getLastNameHelper = (lastName: string): string => {
  if (!lastName) return '';

  const lastNameParts = splitLastName(lastName);
  return getMainLastNamePart(lastNameParts);
};





