import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import UserDetail from "@/components/dashboard/users/UserDetail";

export const metadata = { title: `User Details | Dashboard | ${appConfig.name}` };

interface Props {
  params: { user_id: string };
}

const UserDetailPage = ({ params }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <UserDetail userId={params.user_id} />
    </Box>
  );
};

export default UserDetailPage;