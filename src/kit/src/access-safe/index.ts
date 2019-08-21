/*
    21.08.2019
    This method is aprox 70% slower than safe access
    but is way more readable so it wins in my book.
*/
export const exec = <T>(cb: () => T, alt: T): T => {
    try {
        return cb()
    } catch {
        return alt
    }
}