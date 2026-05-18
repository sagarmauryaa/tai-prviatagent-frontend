"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Summary } from "@/components/dashboard/overview/summary";
import UnansweredTable from "@/components/dashboard/overview/unanswered-table";
import ContactRequestTable from "@/components/dashboard/overview/contat-request-table";
import OverviewFilter from "@/components/dashboard/overview-filter";
import { getDashboardOverView } from "@/utils/backend-endpoints";
import { getTimeEngagement } from "@/utils/generateDateRange";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/components/auth/auth-context";

interface filtersTyepe {
    type?: string;
    start_date?: string;
    end_date?: string;
    totalTokensUsed?: number
    brand?: string;
}
const OverviewPageData = ({ filterParams }: { filterParams: filtersTyepe }) => {
    const [filters, setFilters] = React.useState<{ type?: string; start_date?: string; end_date?: string; brand?: string }>({
        type: filterParams.type ?? "month",
        start_date: filterParams.start_date ?? "",
        end_date: filterParams.end_date ?? "",
        brand: filterParams.brand ?? "all",
    });
    const { currentSubscription } = useAuth();

    const [loading, setLoading] = React.useState(false);

    const [pageData, setpageData] = React.useState({
        unansweredQuestions: [],
        ctaData: [],
        totalTokensUsed: 0,
        totalMessagesExchanged: 0,
        unansweredQuestionsCount: 0,
        sessionData: [
            {
                totalEngagedTime: 0,
                totalMessagesExchanged: 0,
            },
        ],
    })

    const router = useRouter();

    const handleFilter = React.useCallback(async () => {
        try {
            setLoading(true);
            const filterParams = {
                type: filters.type ?? "month",
                start_date: filters.start_date ?? "",
                end_date: filters.end_date ?? "",
                brand: filters.brand ?? "all",
            };
            const { data, status } = await getDashboardOverView(filterParams);
            if (status === 200) {
                setpageData(data.data);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);


    const handleApplyFilter = React.useCallback(() => {
        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                searchParams.set(key, value);
            }
        });
        router.push(`${paths.dashboard.overview}?${searchParams.toString()}`);
        handleFilter();
    }, [filters, router, handleFilter]);


    React.useEffect(() => {
        handleFilter();
    }, []); // Removed handleFilter from dependencies


    return (
        <Box
            sx={{
                maxWidth: "var(--Content-maxWidth)",
                m: "var(--Content-margin)",
                p: "var(--Content-padding)",
                width: "var(--Content-width)",
            }}
        >
            {
                loading ? <Box height={"100%"} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box> :
                    <Stack spacing={4}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
                            <Box sx={{ flex: "1 1 auto" }}>
                                <Typography variant="h4">Dashboard</Typography>
                            </Box>
                        </Stack>
                        <Grid container spacing={4}>
                            <OverviewFilter filters={filters} setFilters={setFilters} handleApplyFilter={handleApplyFilter} />
                            <Grid size={{ xs: 12 }} spacing={4}>
                                <div className="summary_container">
                                    {
                                        currentSubscription &&
                                        <Summary value={`${pageData.totalTokensUsed ?? 0}`} title="Tokens" />
                                    }
                                    <Summary value={`${pageData.totalMessagesExchanged ?? 0}`} title="Messages Exchanged" />
                                    <Summary value={`${pageData.sessionData[0].totalEngagedTime ? getTimeEngagement(pageData.sessionData[0].totalEngagedTime) : 0}`} title="Total Time Engaged" />
                                    <Summary value={`${pageData?.ctaData ?? 0}`} title="Contact Request" />
                                </div>
                            </Grid>
                        </Grid>
                        {
                            currentSubscription &&
                            <>
                                <UnansweredTable />
                                <ContactRequestTable />
                            </>
                        }
                    </Stack>
            }

        </Box>
    )
}

export default OverviewPageData