"use client";

import * as React from "react";
import { Alert, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, InputLabel, OutlinedInput, Select, Stack } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/auth-context";
import { updateDashboardSettings } from "@/utils/backend-endpoints";
import { toast } from "sonner";

const schema = zod.object({
    brandId: zod.string().min(1, { message: "Brand ID is required" }),
    message: zod.string().min(1, "Please enter message.").optional(),
    theme: zod.string().min(1, "Please try agian later.").optional()
});

const defaultValues = {
    brandId: "",
    message: "",
    theme: "light",
}

type FormData = zod.infer<typeof schema>;

export function WelcomeMessage() {
    const { selectedBrand, setSelectedBrand } = useAuth();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isDirty },
        setValue
    } = useForm<FormData>({
        defaultValues,
        resolver: zodResolver(schema)
    });

    const [isPending, setIsPending] = React.useState(false); 

    const onSubmit = React.useCallback(
        async (data: FormData) => {


            if (!data.brandId && !data.message) {
                setError('root', {
                    message: 'Please fill in all required fields'
                });
                return;
            }

            try {
                const msg: string = data?.message ?? '';

                setIsPending(true);
                const { data: response, status } = await updateDashboardSettings(data);

                if (status === 200) {
                    toast.success('Setting updated successfully');
                    setIsPending(false);
                    if (selectedBrand) {
                        setSelectedBrand({ ...selectedBrand, welcomeMessage: msg });
                    }
                } else {
                    setIsPending(false);
                    toast.error('Please try again later.');
                    setError('root', {
                        message: 'Invalid Crediential'
                    });
                    return;
                }
            } catch (error: any) {
                setError('root', {
                    message: error?.message || 'Failed to login'
                });
                setIsPending(false);
            }
        },
        [setError, selectedBrand, setSelectedBrand]
    );



    React.useEffect(() => {
        if (selectedBrand) {
            const { _id, welcomeMessage, chatbotTheme } = selectedBrand;
            setValue('brandId', _id);
            setValue('message', welcomeMessage || '');
            setValue('theme', chatbotTheme || 'light');
        }
    }, [selectedBrand])

    return (
        <Card sx={{ width: "100%" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title="Welcome message"
                />
                <CardContent>
                    <Controller
                        control={control}
                        name="brandId"
                        render={({ field }) => <input type="hidden" {...field} />}
                    />
                    <Controller
                        control={control}
                        name="message"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.message)} fullWidth>
                                <InputLabel>Enter message</InputLabel>
                                <OutlinedInput
                                    multiline
                                    rows={4}
                                    placeholder="Enter message"
                                    {...field}
                                />
                                {errors.message && <FormHelperText>{errors.message.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                    {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                </CardContent>
                <CardActions >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending || !isDirty}
                        startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                    >
                        {isPending ? 'Updating...' : 'Update'}
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}