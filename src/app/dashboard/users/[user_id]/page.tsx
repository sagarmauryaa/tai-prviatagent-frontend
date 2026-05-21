import Box from "@mui/material/Box";
import { appConfig } from "@/config/app";
import UserDetail from "@/components/dashboard/users/UserDetail";
import { getUser } from "@/utils/backend-endpoints";
import { log } from "node:console";

export const metadata = { title: `User Details | Dashboard | ${appConfig.name}` };

interface Props {
  params: Promise<{ user_id: string }>;
}

const UserDetailPage = async ({ params }: Props) => {
  const { user_id } = await params;
  let user = null;

  try {
    const response = await getUser(user_id);
    console.log('response::', response);

    user = response.data?.data?.data ?? response.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }

  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <UserDetail user={user} />
    </Box>
  );
};

export default UserDetailPage;