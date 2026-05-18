"use client";

import * as React from "react";
import { Button, Card, CardContent, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/core/toaster";

const schema = zod.object({
    url: zod
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL")
        .refine((url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }, "Invalid URL format"),
});

const defaultValues = {
    url: "",
}

const WebPageForm = () => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (data) => {
            try {
                // Make API request
                console.log('Submitted URL:', data.url);
                toast.success("Webpage added successfully");
                router.push('/dashboard'); // Update with your actual route
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong!");
            }
        },
        [router]
    );

    return <Card sx={{ width: '100%' }}>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="url"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.url)} fullWidth>
                            <InputLabel required>Add Web URL</InputLabel>
                            <OutlinedInput
                                type="url"
                                placeholder="Enter webpage URL"
                                {...field}
                            />
                            {errors.url ? <FormHelperText>{errors.url.message}</FormHelperText> : null}
                        </FormControl>
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </CardContent>
    </Card>
}

export default WebPageForm;