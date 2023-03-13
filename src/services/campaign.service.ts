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
    AddCampaigns: (campaigns: unknown) => void;
  }
}

type NewCampaign = Omit<
  Campaign,
  "id" | "isActive" | "startDate" | "endDate"
> & {
  readonly startDate: string | Date | number;
  readonly endDate: string | Date | number;
};

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

  private _convertNewCampaignToCampaign(
    id: Campaign["id"],
    campaign: NewCampaign
  ): Campaign {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (!isFinite(campaign.budget) || campaign.budget < 0) {
      throw new Error("Budget should be a positive number");
    }

    if (!isFinite(startDate.valueOf())) {
      throw new Error("Start date should be a valid date");
    }

    if (!isFinite(endDate.valueOf())) {
      throw new Error("End date should be a valid date");
    }

    if (endDate.valueOf() < startDate.valueOf()) {
      throw new Error("End date should be after the start date");
    }

    return {
      ...campaign,
      id,
      startDate,
      endDate,
      isActive: isBetween(new Date(), startDate, endDate),
    };
  }

  public addCampaigns(newCampaigns: readonly NewCampaign[]): void {
    let campaigns = this._campaigns$.getValue();
    newCampaigns.forEach((campaign, index) => {
      const id = idCounter++;

      try {
        campaigns = campaigns.concat(
          this._convertNewCampaignToCampaign(id, campaign)
        );
      } catch (e) {
        console.warn(
          `Skipping new campaign with index ${index} due to a validation error`,
          e
        );
      }
    });
    this._campaigns$.next(campaigns);
  }
}

export const campaignService = new CampaignService();

if (typeof window !== "undefined") {
  window.AddCampaigns = (campaigns: unknown) => {
    const isNewCampaign = (campaign: unknown): campaign is NewCampaign => {
      return (
        isRecordWithProperties(campaign, [
          "name",
          "budget",
          "startDate",
          "endDate",
        ] as const) &&
        typeof campaign.name === "string" &&
        typeof campaign.budget === "number" &&
        (campaign.startDate instanceof Date ||
          typeof campaign.startDate === "string" ||
          typeof campaign.startDate === "number") &&
        (campaign.endDate instanceof Date ||
          typeof campaign.endDate === "string" ||
          typeof campaign.endDate === "number")
      );
    };

    Object.defineProperty(window, "unsafeAddCampaigns", {
      configurable: false,
      writable: false,
    });

    if (Array.isArray(campaigns) && campaigns.every(isNewCampaign)) {
      campaignService.addCampaigns(campaigns);
    } else {
      throw new Error(
        "Invalid data is provided. Campaigns must match this signature: {name: string; budget: number; startDate: string | number | Date; endDate: string | number | Date}[]"
      );
    }
  };
}
