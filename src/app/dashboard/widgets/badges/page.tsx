import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";  
import Grid from "@mui/material/Grid2";

import { appConfig } from "@/config/app";
import RatingWidget from "@/components/dashboard/ratings-widget";

export const metadata = { title: `Review & Rating Widgets | Dashboard | ${appConfig.name}` };

export default function Page() {
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
                        <Typography variant="h4">Review & Rating Widgets</Typography>
                    </Box>
                </Stack>
                <Grid container spacing={4}>
                    <RatingWidget /> 
                </Grid>
            </Stack>
        </Box>
    );
}
