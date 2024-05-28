import { getLastNameHelper } from '@/ui/helpers/getLastNameHelper';

describe('getLastNameHelper', () => {
  it('should return an empty string when given an empty string', () => {
   const result = getLastNameHelper('');
    expect(result).toEqual('');
  });

  it('should return the first last name when it consists of one part', () => {
    const result = getLastNameHelper('García Pérez');
    expect(result).toEqual('García');
  });

  it('should return the last name when it starts with "de" and consists of two parts', () => {
    const result = getLastNameHelper('de Haro Sanchez');
    expect(result).toEqual('de Haro');
  });

  it('should return the first last name when it starts with "de la" and consists three parts', () => {
     const result = getLastNameHelper('de la Fuente Torres');
    expect(result).toEqual('de la Fuente');
  });

  it('should return the first last name when it contain de as a second part', () => {
    const result = getLastNameHelper('Sanchez de Lago');
    expect(result).toEqual('Sanchez');
  });


});
