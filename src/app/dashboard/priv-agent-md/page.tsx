import Box from "@mui/material/Box"; 
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app"; 
import PrivAgentForm from "@/components/dashboard/priv-agent-form"; 

export const metadata = { title: `Prompts | Dashboard | ${appConfig.name}` };

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
      <Box  >
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a365d', mb: 1 }}>
          PrivAgent.md
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Write a custom prompt to guide how the AI agent behaves. This is included in every conversation, similar to a claude.md file.
        </Typography>
        <PrivAgentForm />
      </Box>
    </Box>
  );
}
