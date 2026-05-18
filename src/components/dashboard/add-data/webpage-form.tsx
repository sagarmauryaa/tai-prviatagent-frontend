'use client';
import { Alert, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, InputLabel, LinearProgress, OutlinedInput, Stack, Typography } from '@mui/material'
import React from 'react'
import { Controller, set, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/core/toaster";
import { useAuth } from '@/components/auth/auth-context';
import { addInfoDataWebPage } from '@/utils/backend-endpoints';
import { useRouter } from 'next/navigation';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';

const schema = zod.object({
    url: zod.string()
        .url("Please enter a valid URL")
        .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
            message: "URL must start with http:// or https://"
        })
});

const defaultValues = {
    url: ""
}

const WebPageForm = ({ fetchData }: { fetchData: () => Promise<void> }) => {
    const router = useRouter();
    const { selectedBrand, user } = useAuth();
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues,
        resolver: zodResolver(schema)
    });
    const [isPending, setIsPending] = React.useState(false);
    const [progressList, setProgressList] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);
    const [completed, setCompleted] = React.useState(0);
    const [failedUrls, setFailedUrls] = React.useState<string[]>([]);


    const onSubmit = React.useCallback(async (data: {
        url: string
    }) => {
        if (!user?.userId || !selectedBrand?._id || !data.url) {
            toast.error("Something went wrong!!");
            return;
        }
        setProgressList([]);
        setCompleted(0);
        setTotal(0);
        setFailedUrls([]);
        setIsPending(true);
        try {
            const { data: response, status } = await addInfoDataWebPage({ userId: user.userId, brandId: selectedBrand._id, url: data.url });


            startStreaming(response.jobId);

            // if (status == 200) {
            //     toast.success("Text data added successfully!");
            //     setValue("url", "");
            //     fetchData();
            // } else if (status >= 500) {
            //     toast.error("Server error. Please try again later.");
            // } else {
            //     toast.error(response?.message ?? "Failed to add data. Please try again.");
            // }
        } catch (error: any) {
            setIsPending(false);
            console.error(error);
            toast.error(error?.message ?? "Something went wrong!");
        }

    }, [selectedBrand, user, router]);


    const startStreaming = (jobId: string) => {
        const eventSource = new EventSource(
            `${process.env.V4_APIS}/dashboard/stream/${jobId}`
        );

        let hasError = false;
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'complete') {
                eventSource.close();
                setIsPending(false);

                if (hasError && failedUrls.length > 0) {
                    toast.warning(`Completed with ${failedUrls.length} failed URLs`);
                } else {
                    toast.success("All URLs processed successfully!");
                    setProgressList([]);
                    setCompleted(0);
                    setTotal(0);
                    setFailedUrls([]);
                    setValue("url", "");
                }

                fetchData();
                return;
            }

            setTotal(data.total);

            setProgressList(prev => {
                const updated = [...prev];
                updated[data.current - 1] = data;
                return updated;
            });

            if (data.status === 'done') {
                setCompleted(prev => prev + 1);
            }

            if (data.status === 'error') {
                hasError = true; // 🔥 mark error

                setFailedUrls(prev => {
                    if (prev.includes(data.url)) return prev;
                    return [...prev, data.url];
                });

                if (data.message) {
                    toast.error(`${data.url} → ${data.message}`);
                }
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            setIsPending(false);
            toast.error("Stream connection lost");
        };
    };

    const retryFailed = async () => {
        if (!user?.userId || !selectedBrand?._id) {
            toast.error("Something went wrong!!");
            return;
        }
        if (!failedUrls.length) return;

        setIsPending(true);

        const res = await addInfoDataWebPage({
            userId: user.userId,
            brandId: selectedBrand._id,
            url: failedUrls.join('\n')
        });

        setProgressList(prev =>
            prev.map(item =>
                failedUrls.includes(item.url)
                    ? { ...item, status: 'processing', message: '' }
                    : item
            )
        );

        setFailedUrls([]);
        startStreaming(res.data.jobId);
    };
    return (
        <>
            <Card className="adddata-content" >
                <form onSubmit={handleSubmit(onSubmit)}>

                    <CardContent className="common-textarea">
                        <Controller
                            control={control}
                            name="url"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.url)} fullWidth>
                                    <OutlinedInput
                                        rows={4}
                                        multiline
                                        type='url'
                                        placeholder="Enter Webpage URL(s). Use comma or enter to separate URLs."
                                        {...field} disabled={isPending}
                                        inputProps={{
                                            pattern: "https?://.+",
                                            title: "Please enter a valid URL starting with http:// or https://"
                                        }}
                                    />
                                    {errors.url && <FormHelperText error>{errors.url.message}</FormHelperText>}
                                </FormControl>
                            )}
                        />
                        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                        {progressList.length > 0 && (
                            <Stack spacing={1} mt={2}>
                                {progressList.map((item, index) => (
                                    <Stack
                                        key={index}
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        {/* 🔹 Icon */}
                                        {item.status === 'processing' && (
                                            <CircularProgress size={16} />
                                        )}

                                        {item.status === 'done' && (
                                            <CheckCircleOutline color="success" fontSize="small" />
                                        )}

                                        {item.status === 'error' && (
                                            <ErrorOutline color="error" fontSize="small" />
                                        )}

                                        {/* 🔹 URL */}
                                        <Typography
                                            variant="body2"
                                            sx={{ wordBreak: 'break-all', flex: 1 }}
                                        >
                                            {item.url}
                                        </Typography>

                                        {/* 🔹 Message (only for error) */}
                                        {item.status === 'error' && (
                                            <Typography variant="caption" color="error">
                                                {item.message || 'Failed'}
                                            </Typography>
                                        )}
                                    </Stack>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                    <CardActions
                        className="add-data-cta"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        {!isPending && progressList.length > 0 ? (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                    setProgressList([]);
                                    setCompleted(0);
                                    setTotal(0);
                                    setFailedUrls([]);
                                    setValue("url", "");
                                }}
                            >
                                Clear
                            </Button>
                        ) : (
                            <span />
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isPending}
                            startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                        >
                            {isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                    </CardActions>
                </form>
            </Card >
        </>

    )
}

export default WebPageForm