import { BEMClassHelper } from '@helpers/BEMClassHelper';

describe('BEMClassHelper', () => {
  it('should return the correct BEM class when given an baseClass and an element', () => {
    const baseClass = 'page';
    const element = 'button';
    const expectedClass = 'page__button';

    const result = BEMClassHelper(baseClass, element);

    expect(result).toEqual(expectedClass);
  });

  it('should return the correct BEM class when given an baseClass, and element and a modifier', () => {
    const baseClass = 'page';
    const element = 'button';
    const modifiers = ['primary'];
    const expectedClass = 'page__button page__button--primary';

    const result = BEMClassHelper(baseClass, element, modifiers);

    expect(result).toEqual(expectedClass);
  });

  it('should return the correct BEM class when given an baseClass, and element and more than one modifiers', () => {
    const baseClass = 'page';
    const element = 'button';
    const modifiers = ['primary', 'secondary'];
    const expectedClass =
      'page__button page__button--primary page__button--secondary';

    const result = BEMClassHelper(baseClass, element, modifiers);

    expect(result).toEqual(expectedClass);
  });
});
