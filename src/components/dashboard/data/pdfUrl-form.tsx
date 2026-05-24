'use client';
import { Alert, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material'

import React from 'react'
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/core/toaster";
import { useAuth } from '@/components/auth/auth-context';
import { addInfoDataPDFURL } from '@/utils/backend-endpoints';
import { useRouter } from 'next/navigation';

const schema = zod.object({
    url: zod.string()
        .url("Please enter a valid URL")
        .refine((url) => url.toLowerCase().endsWith('.pdf'), {
            message: "URL must point to a PDF file"
        })
        .optional()
        .nullable(),
});

const defaultValues = {
    url: ""
}

const PDFUrlForm = ({ fetchData }: { fetchData: () => Promise<void> }) => {
    const router = useRouter();

    const { selectedBrand, user, currentSubscription, updateDataSize } = useAuth();
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues,
        resolver: zodResolver(schema)
    });
    const [isPending, setIsPending] = React.useState(false);


    const onSubmit = React.useCallback(async (data: {
        url: string
    }) => {
        if (!user?.userId || !selectedBrand?._id || !data.url) {
            toast.error("Something went wrong!");
            return;
        }
        setIsPending(true);
        try {
            const { data: response, status } = await addInfoDataPDFURL({ userId: user.userId, brandId: selectedBrand._id, url: data.url })
            if (status == 200) {
                toast.success("Text data added successfully!");
                setValue("url", "");
                fetchData();
                router.refresh();
            }
            setIsPending(false);
        } catch (error: any) {
            setIsPending(false);
            console.error(error);
            toast.error(error?.message ?? "Something went wrong!");
        }
    }, [selectedBrand, user, router]);

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
                                        type='url'
                                        placeholder="Enter PDF URL"
                                        {...field}
                                        inputProps={{
                                            pattern: "https?://.+\\.pdf$",
                                            title: "Please enter a valid PDF URL starting with http:// or https://"
                                        }}
                                    />
                                    {errors.url && <FormHelperText error>{errors.url.message}</FormHelperText>}
                                </FormControl>
                            )}
                        />
                        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }} className="add-data-cta">
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

export default PDFUrlForm