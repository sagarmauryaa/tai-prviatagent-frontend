import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";  
import { appConfig } from "@/config/app"; 
import { ChatbotWidget } from "@/components/dashboard/settings/chatbot-widget";

export const metadata = { title: `Chatbot integration | Dashboard | ${appConfig.name}` };

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
                        <Typography variant="h4">Chatbot integration</Typography>
                    </Box>
                </Stack>

                <ChatbotWidget /> 
            </Stack>
        </Box>
    );
}
