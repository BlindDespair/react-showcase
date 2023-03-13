import { differenceInMilliseconds } from "date-fns";

export function getClosestFutureDate(
  currentDate: Date,
  datesToChooseFrom: readonly Date[]
): Date | null {
  return datesToChooseFrom.reduce<Date | null>((acc, date) => {
    const differenceWithAcc =
      acc !== null
        ? differenceInMilliseconds(acc, currentDate)
        : Number.POSITIVE_INFINITY;
    const differenceWithDate = differenceInMilliseconds(date, currentDate);
    if (differenceWithDate > 0 && differenceWithDate < differenceWithAcc) {
      return date;
    }
    return acc;
  }, null);
}
