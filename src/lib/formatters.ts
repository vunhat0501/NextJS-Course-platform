export function formatPrice(price: number) {
    return `$${price.toFixed(2)}`;
}

export function formatPlural(count: number, { singular, plural }: { singular: string; plural: string }) {
  return `${count} ${count === 1 ? singular : plural}`;
}
