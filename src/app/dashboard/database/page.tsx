import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import ProjectsPageData from "@/components/dashboard/projects/ProjectListing";

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
      <ProjectsPageData />
    </Box>
  )
}

export default ProjectsPage