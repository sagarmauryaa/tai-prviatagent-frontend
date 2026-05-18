import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import ProjectDetail from "@/components/dashboard/projects/ProjectDetail";

export const metadata = { title: `Project Details | Dashboard | ${appConfig.name}` };

const ProjectDetailPage = ({ params }: { params: { project_id: string } }) => {
  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <ProjectDetail projectId={params.project_id} />
    </Box>
  );
};

export default ProjectDetailPage;