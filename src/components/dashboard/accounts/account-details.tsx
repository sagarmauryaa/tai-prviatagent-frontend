"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { useAuth } from "@/components/auth/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { updateMyProfile } from "@/utils/backend-endpoints";
import { toast } from "sonner";
import { Alert, CircularProgress, FormHelperText, Typography } from "@mui/material";

const schema = zod.object({
    fullName: zod.string().min(1, { message: "Full name is required" }),
});

type FormValues = zod.infer<typeof schema>;

export function AccountDetails() {
    const { user, updateUser } = useAuth();
    const [isPending, setIsPending] = React.useState(false);

    const defaultValues: FormValues = {
        fullName: user?.fullName ?? '',
    };

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isDirty }
    } = useForm<FormValues>({
        defaultValues,
        resolver: zodResolver(schema)
    });

    // Sync form when user context loads
    React.useEffect(() => {
        reset({ fullName: user?.fullName ?? '' });
    }, [user, reset]);

    const handleCancel = () => {
        reset(defaultValues);
    };

    const onSubmit = React.useCallback(async (data: FormValues) => {
        try {
            setIsPending(true);
            const { status } = await updateMyProfile(data);

            if (status === 200) {
                updateUser({ fullName: data.fullName });
                toast.success('Profile updated successfully');
                reset(data);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error(error);
            setError('root', {
                message: 'Failed to update profile. Please try again later.'
            });
            toast.error('Failed to update profile');
        } finally {
            setIsPending(false);
        }
    }, [updateUser, setError, reset]);

    const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader
                    title="Basic details"
                />
                <CardContent>
                    <Stack spacing={2}>
                        {/* Read-only username */}
                        <FormControl disabled>
                            <InputLabel>Username</InputLabel>
                            <OutlinedInput value={user?.username ?? ''} label="Username" readOnly />
                        </FormControl>

                        {/* Editable full name */}
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.fullName)}>
                                    <InputLabel required>Full Name</InputLabel>
                                    <OutlinedInput {...field} label="Full Name" disabled={isPending} />
                                    {errors.fullName && <FormHelperText>{errors.fullName.message}</FormHelperText>}
                                </FormControl>
                            )}
                        />

                        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button onClick={handleCancel} disabled={isPending || !isDirty} variant="text">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending || !isDirty}
                        startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                    >
                        {isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}