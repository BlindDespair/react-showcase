import { type NextPage } from "next";
import Head from "next/head";
import CampaignTable from "~/components/campaign-table";
import CampaignFiltersForm from "~/components/campaign-filters-form";
import { useCampaigns } from "~/hooks/use-campaigns";
import { useCallback, useState } from "react";
import { type CampaignFilters } from "~/types/campaign-filters";

const Home: NextPage = () => {
  const [filters, setFilters] = useState<CampaignFilters>({});
  const campaigns = useCampaigns(filters);

  const onFiltersChange = useCallback((newFilters: CampaignFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <>
      <Head>
        <title>React Showcase</title>
        <meta
          name="description"
          content="App to try out React and showcase skills"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Campaigns
          </h1>
          <CampaignFiltersForm onChange={onFiltersChange}></CampaignFiltersForm>
          <div className="w-full overflow-x-auto">
            <CampaignTable campaigns={campaigns}></CampaignTable>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
