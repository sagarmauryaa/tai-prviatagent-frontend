import Box from "@mui/material/Box";
import { appConfig } from "@/config/app"; 
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AddProject from "@/components/dashboard/projects/AddProject";

export const metadata = { title: `Projects | Dashboard | ${appConfig.name}` };
const ProjectsPage = () => {
  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      {/* <ProjectsPageData /> */}
      <Stack spacing={4}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
          <Stack spacing={4} sx={{ width: "100%" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h4">Projects</Typography>
              <Stack direction="row" spacing={3} alignItems="center">
                <AddProject />
              </Stack>
              </Stack>
            </Stack> 
        </Stack>
      </Stack>
    </Box>
  )
}

export default ProjectsPage