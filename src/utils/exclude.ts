/**
 * Function to exclude some fields from a query
 * Doesn't work for nested objects
 * However, this function can be improved
 * See https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export function exclude<T extends Record<any, any>, K extends keyof T>(
  record: T,
  keys: Array<K>,
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(record).filter(
      (value: [any, any]) => !keys.includes(value[0]),
    ),
  ) as T;
}
