import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import FilesListing from "@/components/dashboard/files/FilesListing";

export const metadata = { title: `Files | Dashboard | ${appConfig.name}` };
const FilesPage = () => {
  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <FilesListing />
    </Box>
  )
}

export default FilesPage