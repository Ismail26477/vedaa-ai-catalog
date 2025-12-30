// Utility functions for handling dates from API responses
export const parseDate = (date: string | Date): Date => {
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

export const getTimestamp = (date: string | Date): number => {
  return parseDate(date).getTime()
}
