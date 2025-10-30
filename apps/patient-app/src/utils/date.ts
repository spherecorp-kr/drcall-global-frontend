/**
 * Date formatting utilities
 */

/**
 * Format Date to DD/MM/YYYY
 * @param date - Date object to format
 * @returns Formatted date string (e.g., "14/04/1998")
 */
export function formatDate(date: Date | null): string {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format Date with time slot to DD/MM/YYYY HH:mm
 * @param date - Date object
 * @param timeSlot - Time slot string (e.g., "14:01~14:15")
 * @returns Formatted datetime string (e.g., "10/05/2023 14:01~14:15")
 */
export function formatDateTime(date: Date | null, timeSlot: string | null): string {
  if (!date || !timeSlot) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year} ${timeSlot}`;
}

/**
 * Parse date string (DD/MM/YYYY) to Date object
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  if (!day || !month || !year) return null;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
