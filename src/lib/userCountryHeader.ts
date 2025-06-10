export function setUserCountryHeader(
    headers: Headers,
    country: string | undefined,
) {
    if (country) {
        headers.set('x-user-country', country);
    }
}
