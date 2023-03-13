import { type CampaignFilters } from "./../types/campaign-filters";
import { campaignService } from "./../services/campaign.service";
import { useMemo, useState } from "react";
import { Subscription } from "rxjs";
import { type Campaign } from "./../types/campaign";
import { isAfter, isBefore } from "date-fns";
import { useIsomorphicLayoutEffect } from "./use-isomorfic-layout-effect";

export function useCampaigns(filters?: CampaignFilters): readonly Campaign[] {
  const [campaigns, setCampaigns] = useState<readonly Campaign[]>([]);

  useIsomorphicLayoutEffect(() => {
    const subscription = new Subscription();
    subscription.add(
      campaignService.campaigns$.subscribe((storedCampaigns) => {
        setCampaigns(storedCampaigns);
      })
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter(
        (campaign) =>
          filters !== undefined &&
          campaign.name
            .toLowerCase()
            .includes((filters.name ?? "").toLowerCase()) &&
          (filters.startDate === undefined ||
            isAfter(campaign.startDate, filters.startDate)) &&
          (filters.endDate === undefined ||
            isBefore(campaign.endDate, filters.endDate))
      ),
    [campaigns, filters]
  );

  return filteredCampaigns;
}
