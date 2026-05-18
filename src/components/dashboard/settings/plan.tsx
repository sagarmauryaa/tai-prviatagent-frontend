'use client';
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import RouterLink from "next/link";

import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";
import { useAuth } from "@/components/auth/auth-context";
import { CardActions, Modal } from "@mui/material";

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

export function Plans() {
    const [modalOpen, setModalOpen] = React.useState(false);

    const { currentSubscription } = useAuth();


    if (currentSubscription) {
        return (
            <Card>

                <CardHeader
                    avatar={
                        <Avatar>
                            <CreditCardIcon fontSize="var(--Icon-fontSize)" />
                        </Avatar>
                    } 
                    title="Change plan"
                />
                <CardContent>
                    <Stack divider={<Divider />} spacing={3}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 1 }} variant="outlined">

                                <PropertyList divider={<Divider />} sx={{ "--PropertyItem-padding": "12px 24px" }}>
                                    {[
                                        { key: "Plan Name", value: currentSubscription?.name },
                                        { key: "Start Date", value: new Date(currentSubscription.activeDate).toLocaleDateString() },
                                        { key: "End Date", value: new Date(currentSubscription.endDate).toLocaleDateString() },
                                        { key: "Token", value: currentSubscription.totalToken.toLocaleString() },
                                        { key: "Data Size(In MB)", value: currentSubscription.totalDatasize ? currentSubscription.totalDatasize.toLocaleString() + ' MB' : '0 MB' },
                                        { key: "Custome profile", value: currentSubscription.allowAvatar ? 'Yes' : 'No' },
                                        { key: "Chatbot Theme", value: currentSubscription.allowChatTheme ? 'Yes' : 'No' },
                                        { key: "CSV File Upload", value: currentSubscription.allowCsv ? 'Yes' : 'No' },
                                        { key: "CopyRight Remove", value: currentSubscription.isCopyrighted ? 'Yes' : 'No' },
                                    ].map((item) => (
                                        <PropertyItem key={item.key} name={item.key} value={item.value} />
                                    ))}
                                </PropertyList>

                            </Card>
                            <Typography color="text.secondary" variant="body2">
                                We cannot refund once you purchased a subscription, but you can always{" "}
                                <Link
                                    variant="inherit"
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setModalOpen(true)
                                    }}
                                >
                                    cancel
                                </Link>
                            </Typography>
                        </Stack> 
                    </Stack>
                </CardContent>
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="delete-confirmation-modal"
                >
                    <Box sx={MODAL_STYLE}>
                        <Card sx={{ width: "100%", maxWidth: '400px' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    ⚠️ Cancel Subscription
                                </Typography>
                                <Typography sx={{ mt: 2 }}>
                                    To cancel your subscription, please email us at cancellations@tellofy.com. The cancellation will be effective from the end of your current billing cycle. Please note that we do not provide prorated refunds.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    type="button"
                                    sx={{ width: 'fit-content', ml: 'auto' }}
                                    variant="text"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    sx={{ width: 'fit-content', ml: 'auto' }}
                                    variant="contained" 
                                    onClick={() => setModalOpen(false)}
                                >
                                    Ok
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                </Modal>
            </Card>
        );
    }
    else {
        return (
            <Card>

                <CardHeader
                    avatar={
                        <Avatar>
                            <CreditCardIcon fontSize="var(--Icon-fontSize)" />
                        </Avatar>
                    } 
                    title="Change plan"
                />
                <CardContent>
                    <Stack divider={<Divider />} spacing={3}>
                        <Stack spacing={3}>
                            <Typography color="text.secondary" variant="h6">
                                You currently don't have any active subscription packages.
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                Please purchase a subscription to access our premium features. Choose a plan that best suits your needs and unlock advanced capabilities for your chatbot.
                            </Typography>
                        </Stack>
                        <Stack spacing={3}>
                            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                                <Button component={RouterLink} href="/dashboard/subscription-plans" variant="contained">View plans</Button>
                            </Box>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        );
    }
}