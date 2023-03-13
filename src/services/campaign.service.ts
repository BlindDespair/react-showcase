import { type Campaign } from "./../types/campaign";
import {
  BehaviorSubject,
  EMPTY,
  expand,
  map,
  of,
  switchMap,
  throttleTime,
  timer,
} from "rxjs";
import { randomDate } from "~/utils/random-date";
import { randomInt } from "~/utils/random-int";
import { isRecordWithProperties } from "~/utils/is-record";
import { isBetween } from "~/utils/is-between";
import { getClosestFutureDate } from "~/utils/get-closest-date";

declare global {
  interface Window {
    unsafeAddCampaigns: (campaigns: unknown) => void;
  }
}

type NewCampaign = Omit<Campaign, "id">;

/**
 * Simulating auto-increment feature of a database
 */
let idCounter = 0;

function generateCampaigns(amount = 500): readonly Campaign[] {
  const campaigns: Campaign[] = [];
  for (let i = 0; i <= amount; i++) {
    const startDate = randomDate(
      new Date("01-01-2022"),
      new Date("01-01-2024")
    );
    const endDate = randomDate(startDate, new Date("01-01-2025"));
    campaigns.push({
      id: idCounter,
      budget: randomInt(10, 999),
      name: `Campaign ${idCounter}`,
      startDate,
      endDate,
      isActive: isBetween(new Date(), startDate, endDate),
    });
    idCounter++;
  }
  return campaigns;
}

class CampaignService {
  private readonly _campaigns$ = new BehaviorSubject<readonly Campaign[]>(
    generateCampaigns()
  );

  public readonly campaigns$ = this._campaigns$.asObservable().pipe(
    switchMap((campaigns) =>
      of(campaigns).pipe(
        expand((campaigns) => {
          const currentDate = new Date();
          const nextUpdate = campaigns.reduce<Date | null>((acc, campaign) => {
            return getClosestFutureDate(currentDate, [
              ...(acc !== null ? [acc] : []),
              campaign.startDate,
              campaign.endDate,
            ]);
          }, null);
          return nextUpdate !== null
            ? timer(nextUpdate).pipe(map(() => campaigns))
            : EMPTY;
        }, 1),
        throttleTime(1000, undefined, { leading: true, trailing: true }),
        map((campaigns) =>
          campaigns.map((campaign) => ({
            ...campaign,
            isActive: isBetween(
              new Date(),
              campaign.startDate,
              campaign.endDate
            ),
          }))
        )
      )
    )
  );

  public addCampaigns(newCampaigns: readonly NewCampaign[]): void {
    let campaigns = this._campaigns$.getValue();
    newCampaigns.forEach((campaign) => {
      campaigns = campaigns.concat({ ...campaign, id: idCounter++ });
    });
    this._campaigns$.next(campaigns);
  }
}

export const campaignService = new CampaignService();

if (typeof window !== "undefined") {
  window.unsafeAddCampaigns = (campaigns: unknown) => {
    const isValidNewCampaign = (campaign: unknown): campaign is NewCampaign => {
      return (
        isRecordWithProperties(campaign, [
          "name",
          "budget",
          "startDate",
          "endDate",
        ] as const) &&
        typeof campaign.name === "string" &&
        typeof campaign.budget === "number" &&
        isFinite(campaign.budget) &&
        campaign.budget > 0 &&
        campaign.startDate instanceof Date &&
        isFinite(campaign.startDate.valueOf()) &&
        campaign.endDate instanceof Date &&
        isFinite(campaign.endDate.valueOf()) &&
        campaign.endDate > campaign.startDate
      );
    };
    Object.defineProperty(window, "unsafeAddCampaigns", {
      configurable: false,
      writable: false,
    });

    if (Array.isArray(campaigns) && campaigns.every(isValidNewCampaign)) {
      campaignService.addCampaigns(campaigns);
    } else {
      throw new Error(
        "Invalid data is provided. Campaigns must match this signature: {name: string; budget: number; startDate: Date; endDate: Date}[]"
      );
    }
  };
}
