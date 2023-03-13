import { format } from "date-fns";
import { type FunctionComponent, type PropsWithChildren } from "react";
import { type Campaign } from "~/types/campaign";

const CampaignTh: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <th className="border-b border-slate-600 bg-slate-900 p-4 py-3 pl-8 text-left font-medium text-slate-200">
    {children}
  </th>
);

const CampaignTd: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <td className="border-b  border-slate-700 p-4 pl-8 text-slate-400">
    {children}
  </td>
);

const CampaignTable: FunctionComponent<{ campaigns: readonly Campaign[] }> = ({
  campaigns,
}) => {
  return (
    <table className="w-full table-auto border-collapse text-white">
      <thead className=" text-left text-2xl">
        <tr>
          {/*
           Hardcoding certain text is not a bad thing as it's defined by UI and not by the data alone
           It can later utilize any sort of i18n solution
          */}
          <CampaignTh></CampaignTh>
          <CampaignTh>Name</CampaignTh>
          <CampaignTh>Budget</CampaignTh>
          <CampaignTh>Start Date</CampaignTh>
          <CampaignTh>End Date</CampaignTh>
        </tr>
      </thead>
      <tbody className="bg-slate-800">
        {campaigns.map((campaign) => (
          <tr key={campaign.id}>
            <CampaignTd>
              <div
                className={`h-5 w-5 rounded ${
                  campaign.isActive ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
            </CampaignTd>
            <CampaignTd>{campaign.name}</CampaignTd>
            {/* in real world currency might need to be dynamic, it would most likely involve a react hook to get it */}
            <CampaignTd>{`${campaign.budget}$`}</CampaignTd>
            <CampaignTd>{format(campaign.startDate, "dd/MM/yyy")}</CampaignTd>
            <CampaignTd>{format(campaign.endDate, "dd/MM/yyy")}</CampaignTd>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CampaignTable;
