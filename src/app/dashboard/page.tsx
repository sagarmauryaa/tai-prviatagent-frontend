import * as React from "react"; 
import { appConfig } from "@/config/app"; 
import OverviewPageData from "@/components/dashboard/overview/page-data";
 
export const metadata = { title: `Overview | Dashboard | ${appConfig.name}` };
  
export default async function ({ searchParams }: { searchParams?: Promise<{ type?: string; start_date?: string; end_date?: string; brand?: string }> }) {
	const query = await searchParams ?? {};
	const { type, start_date, end_date, brand } = query;
	const filters = { type: type ?? "month", start_date: start_date ?? '', end_date: end_date ?? '', brand: brand ?? 'all' };

	return (
		<OverviewPageData filterParams={filters} />
	);
}