export function BEMClassHelper(
  block: string,
  element?: string,
  modifiers?: string[] | false | string,
): string {
  const baseClass = block;
  const elementClass = element ? `${baseClass}__${element}` : '';

  let modifierClasses = '';
  if (Array.isArray(modifiers)) {
    modifierClasses = modifiers
      ? modifiers
          .filter(Boolean)
          .map((modifier) => `${elementClass}--${modifier}`)
          .join(' ')
      : '';
  } else if (modifiers) {
    modifierClasses = `${elementClass}--${modifiers}`;
  }

  const classes = [elementClass, modifierClasses].filter(Boolean).join(' ');

  return classes || baseClass;
}
