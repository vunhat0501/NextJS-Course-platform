export function sumArray<T>(array: T[], callback: (item: T) => number) {
    return array.reduce((sum, item) => sum + callback(item), 0);
}
