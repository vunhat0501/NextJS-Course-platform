const COUNTRY_HEADER_KEY = 'x-user-country';

//** Tranh user fake country trong header */
export function setUserCountryHeader(
    headers: Headers,
    country: string | undefined,
) {
    if (country === null || country === undefined) {
        headers.delete(COUNTRY_HEADER_KEY);
    } else {
        headers.set(COUNTRY_HEADER_KEY, country);
    }
}
