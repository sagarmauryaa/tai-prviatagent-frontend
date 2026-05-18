import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AddUser from "@/components/dashboard/users/AddUser";

export const metadata = { title: `Users | Dashboard | ${appConfig.name}` };
const UsersPage = () => {
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
              <Typography variant="h4">Users</Typography>
              <Stack direction="row" spacing={3} alignItems="center">
                <AddUser />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default UsersPage