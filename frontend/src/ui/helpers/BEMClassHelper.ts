export function BEMClassHelper(
  block: string,
  element?: string,
  modifiers?: string[] | false,
): string {
  const baseClass = block;
  const elementClass = element ? `${baseClass}__${element}` : '';
  const modifierClasses = modifiers
    ? modifiers.map((modifier) => `${elementClass}--${modifier}`).join(' ')
    : '';

  const classes = [elementClass, modifierClasses].filter(Boolean).join(' ');

  return classes || baseClass;
}
