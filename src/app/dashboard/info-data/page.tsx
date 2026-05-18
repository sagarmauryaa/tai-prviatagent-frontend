
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { appConfig } from "@/config/app";
import InfoData from "@/components/dashboard/add-data/info-data";

export const metadata = { title: `Add Data | Dashboard | ${appConfig.name}` };



export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
    const params = await searchParams as Record<string, string>;


    return (
        <Box
            sx={{
                maxWidth: "var(--Content-maxWidth)",
                m: "var(--Content-margin)",
                p: "var(--Content-padding)",
                width: "var(--Content-width)",
            }}
        >

            <Stack spacing={4}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
                    <Box sx={{ flex: "1 1 auto" }}>
                        <Typography variant="h4">Add Data</Typography>
                    </Box>
                </Stack>
                <InfoData searchParams={params} />
            </Stack>
        </Box>
    );
}
