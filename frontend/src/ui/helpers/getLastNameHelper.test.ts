import { getLastNameHelper } from '@/ui/helpers/getLastNameHelper';

describe('getLastNameHelper', () => {
  it('should return an empty string when given an empty string', () => {
    const lastName = '';
    const expected = '';

    const result = getLastNameHelper(lastName);

    expect(result).toEqual(expected);
  });

  it('should return the first last name when it consists of one part', () => {
    const lastName = 'García Pérez';
    const expected = 'García';

    const result = getLastNameHelper(lastName);

    expect(result).toEqual(expected);
  });

  it('should return the last name when it starts with "de" and consists of two parts', () => {
    const lastName = 'de Haro Sanchez';
    const expected = 'de Haro';

    const result = getLastNameHelper(lastName);

    expect(result).toEqual(expected);
  });

  it('should return the first last name when it starts with "de la" and consists three parts', () => {
    const lastName = 'de la Fuente Torres';
    const expected = 'de la Fuente';

    const result = getLastNameHelper(lastName);

    expect(result).toEqual(expected);
  });

  it('should return the first last name when it contain de as a second part', () => {
    const lastName = 'Sanchez de Lago';
    const expected = 'Sanchez';

    const result = getLastNameHelper(lastName);

    expect(result).toEqual(expected);
  });


});
