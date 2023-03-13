import {
  type ChangeEvent,
  useCallback,
  useState,
  type FunctionComponent,
  useEffect,
} from "react";
import { type CampaignFilters } from "~/types/campaign-filters";

const CampaignFiltersForm: FunctionComponent<{
  onChange: (filters: CampaignFilters) => void;
}> = ({ onChange }) => {
  const [state, setState] = useState<CampaignFilters>({});

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, name: event.target.value }));
  }, []);

  const onStartDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setState((state) => ({
        ...state,
        startDate:
          event.target.value !== "" ? new Date(event.target.value) : undefined,
      }));
    },
    []
  );

  const onEndDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setState((state) => ({
        ...state,
        endDate:
          event.target.value !== "" ? new Date(event.target.value) : undefined,
      }));
    },
    []
  );

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <div className="align-center flex w-full gap-4">
      <label className="flex flex-col gap-2 text-white">
        Campaign Name
        <input
          type="text"
          name="campaignName"
          className="rounded-md border-0 bg-slate-700 py-1.5 text-slate-200 ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          placeholder="Start typing..."
          onChange={onNameChange}
        />
      </label>

      <label className="flex flex-col gap-2 text-white">
        Start Date
        <input
          type="date"
          className="rounded-md border-0 bg-slate-700 py-1.5 text-slate-200 ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          placeholder="Start date"
          onChange={onStartDateChange}
        />
      </label>

      <label className="flex flex-col gap-2 text-white">
        End Date
        <input
          type="date"
          className="rounded-md border-0 bg-slate-700 py-1.5 text-slate-200 ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          placeholder="Start date"
          onChange={onEndDateChange}
        />
      </label>
    </div>
  );
};

export default CampaignFiltersForm;
