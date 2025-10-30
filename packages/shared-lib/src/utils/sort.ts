/**
 * Common sorting utilities
 */

/**
 * Parse date string to timestamp
 * Handles various date formats (YYYY-MM-DD, YYYY/MM/DD, etc.)
 */
function parseDateToTimestamp(dateString: string): number {
  // Replace / with - for consistent parsing
  const normalized = dateString.replace(/\//g, '-');
  return new Date(normalized).getTime();
}

/**
 * Sort by date (newest first)
 */
export function sortByDateNewest<T>(
  items: T[],
  getDate: (item: T) => string
): T[] {
  return [...items].sort((a, b) => {
    const dateA = parseDateToTimestamp(getDate(a));
    const dateB = parseDateToTimestamp(getDate(b));
    return dateB - dateA;
  });
}

/**
 * Sort by date (oldest first)
 */
export function sortByDateOldest<T>(
  items: T[],
  getDate: (item: T) => string
): T[] {
  return [...items].sort((a, b) => {
    const dateA = parseDateToTimestamp(getDate(a));
    const dateB = parseDateToTimestamp(getDate(b));
    return dateA - dateB;
  });
}

/**
 * Sort by date with custom order
 */
export function sortByDate<T>(
  items: T[],
  getDate: (item: T) => string,
  order: 'newest' | 'oldest' = 'newest'
): T[] {
  return order === 'newest'
    ? sortByDateNewest(items, getDate)
    : sortByDateOldest(items, getDate);
}

/**
 * Sort by timestamp (newest first)
 */
export function sortByTimestampNewest<T>(
  items: T[],
  getTimestamp: (item: T) => number
): T[] {
  return [...items].sort((a, b) => {
    return getTimestamp(b) - getTimestamp(a);
  });
}

/**
 * Sort by timestamp (oldest first)
 */
export function sortByTimestampOldest<T>(
  items: T[],
  getTimestamp: (item: T) => number
): T[] {
  return [...items].sort((a, b) => {
    return getTimestamp(a) - getTimestamp(b);
  });
}

/**
 * Sort by timestamp with custom order
 */
export function sortByTimestamp<T>(
  items: T[],
  getTimestamp: (item: T) => number,
  order: 'newest' | 'oldest' = 'newest'
): T[] {
  return order === 'newest'
    ? sortByTimestampNewest(items, getTimestamp)
    : sortByTimestampOldest(items, getTimestamp);
}
