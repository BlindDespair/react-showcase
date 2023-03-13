import { getClosestFutureDate } from "./get-closest-date";

describe("getClosestFutureDate", () => {
  it("it should return the closest future date to date", () => {
    const expectedDate = new Date("2022-03-16");
    expect(
      getClosestFutureDate(new Date("2022-03-12"), [
        new Date("2022-05-07"),
        new Date("2022-02-17"),
        expectedDate,
      ])
    ).toBe(expectedDate);
  });

  it("it should return null when none of the dates is in the future", () => {
    expect(
      getClosestFutureDate(new Date("2022-03-12"), [
        new Date("2022-03-07"),
        new Date("2021-02-17"),
        new Date("2021-12-17"),
      ])
    ).toBe(null);
  });
});
