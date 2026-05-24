import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import FileDetail from "@/components/dashboard/files/FileDetail";

export const metadata = { title: `File Details | Dashboard | ${appConfig.name}` };

interface Props {
  params: Promise<{ file_id: string }>;
  searchParams: Promise<{ projectId?: string }>;
}

const FileDetailPage = async ({ params, searchParams }: Props) => {
  const { file_id } = await params;
  const { projectId } = await searchParams;

  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <FileDetail fileId={file_id} projectId={projectId} />
    </Box>
  );
};

export default FileDetailPage;
