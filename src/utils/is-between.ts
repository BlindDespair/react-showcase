import { isAfter, isBefore } from "date-fns";

export function isBetween(date: Date, startDate: Date, endDate: Date): boolean {
  return isAfter(date, startDate) && isBefore(date, endDate);
}
