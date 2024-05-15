export function convertISOToDDMMYYYY(date: string) {
  const fecha = new Date(date);

  const day = fecha.getUTCDate();
  const month = fecha.getUTCMonth() + 1;
  const year = fecha.getUTCFullYear();

  const dayString = day < 10 ? '0' + day : day;
  const monthString = month < 10 ? '0' + month : month;

  const fechaDDMMYYYY =
    dayString.toString() + monthString.toString() + year.toString();

  return fechaDDMMYYYY;
}
