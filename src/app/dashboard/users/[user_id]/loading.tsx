import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const UserDetailLoading = () => {
    return (
        <Box
            sx={{
                maxWidth: "var(--Content-maxWidth)",
                m: "var(--Content-margin)",
                p: "var(--Content-padding)",
                width: "var(--Content-width)",
            }}
        >
            <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
                    <Stack spacing={1} sx={{ width: "100%", maxWidth: 480 }}>
                        <Skeleton variant="text" width="40%" height={40} />
                        <Skeleton variant="text" width="30%" height={24} />
                    </Stack>
                    <Skeleton variant="rectangular" width={140} height={42} sx={{ borderRadius: 2 }} />
                </Stack>

                <Card sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Skeleton variant="circular" width={56} height={56} />
                            <Stack spacing={1} sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" height={30} />
                                <Skeleton variant="text" width="40%" height={20} />
                            </Stack>
                        </Stack>
                        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Card>

                <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
                    <Stack spacing={3} sx={{ flex: 1, width: "100%" }}>
                        <Card sx={{ p: 3 }}>
                            <Skeleton variant="rectangular" width="100%" height={220} sx={{ borderRadius: 2 }} />
                        </Card>
                        <Card sx={{ p: 3 }}>
                            <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2 }} />
                        </Card>
                    </Stack>
                    <Stack spacing={3} sx={{ flex: 1, width: "100%" }}>
                        <Card sx={{ p: 3 }}>
                            <Skeleton variant="rectangular" width="100%" height={260} sx={{ borderRadius: 2 }} />
                        </Card>
                        <Card sx={{ p: 3 }}>
                            <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2 }} />
                        </Card>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default UserDetailLoading;
