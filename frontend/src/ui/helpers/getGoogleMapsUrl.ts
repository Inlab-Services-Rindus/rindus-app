export function getGoogleMapsUrl(address: string): string {
  let formattedAddress = address.replace(/, /g, ',+').replace(/ /g, '+');

  formattedAddress = encodeURIComponent(formattedAddress);

  return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
}
