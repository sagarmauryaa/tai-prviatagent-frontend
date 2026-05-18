import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { appConfig } from "@/config/app";
import IframeChatbot from "./iframe-chatbot";
import Heading from "./heading";

export const metadata = { title: `Chatbot Demo | Dashboard | ${appConfig.name}` };

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
                <Heading />
                <Stack id="iframe-root" sx={{ width: "100%", border: "none" }}>
                    <IframeChatbot />
                </Stack>
            </Stack>
        </Box>
    );
}
