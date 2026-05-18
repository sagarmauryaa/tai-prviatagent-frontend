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
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { useAuth } from "@/components/auth/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { updateProfile } from "@/utils/backend-endpoints";
import { toast } from "sonner";
import { Alert, CircularProgress, FormHelperText } from "@mui/material";

const schema = zod.object({
    userId: zod.string().min(1, { message: "User ID is required" }),
    phone: zod.string().min(10, { message: "Phone number is required" }).regex(/^\+?[1-9]\d{1,10}$/, { message: "Invalid phone number format" }),
    firstName: zod.string().min(1, { message: "First name is required" }),
    lastName: zod.string().min(1, { message: "Last name is required" }),
});

type FormValues = zod.infer<typeof schema>;

export function AccountDetails() {
    const auth = useAuth();
    const router = useRouter();
    const { user } = auth;
    const [isPending, setIsPending] = React.useState(false);

    const defaultValues: FormValues = {
        userId: user?.userId ?? '',
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        phone: user?.phone ?? ''
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

    const handleCancel = () => {
        reset(defaultValues);
    };

    const onSubmit = React.useCallback(async (data: FormValues) => { 

        if (!data.userId || !data.firstName || !data.lastName) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsPending(true);
            const { data: response, status } = await updateProfile(data);

            if (status === 200) {
                const { userId, lastName, firstName, email, phone, token } = response.data;
                console.log({ userId, lastName, firstName, email, phone });
                
                auth.setUser({ userId, lastName, firstName, email, phone });
                Cookies.set('access_token', token);
                toast.success('Profile updated successfully');
                router.refresh();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
            setError('root', {
                message: 'Failed to update profile. Please try again later.'
            });
        } finally {
            setIsPending(false);
        }
    }, [auth, router, setError, setIsPending]);

    React.useEffect(() => {
        reset(defaultValues);
    }, [user, reset]);


    const handleTelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10); // Remove non-digits & limit to 10 digits
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar>
                            <UserIcon fontSize="var(--Icon-fontSize)" />
                        </Avatar>
                    }
                    title="Basic details"
                />
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={2}>
                            <Controller
                                control={control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.firstName)}>
                                        <InputLabel required>First Name</InputLabel>
                                        <OutlinedInput {...field} disabled={isPending} />
                                        {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.lastName)}>
                                        <InputLabel required>Last name</InputLabel>
                                        <OutlinedInput {...field} disabled={isPending} />
                                        {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="phone"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.phone)}>
                                        <InputLabel required>Phone number</InputLabel>
                                        <OutlinedInput {...field} type="tel" inputProps={{
                                            maxLength: 10,
                                            pattern: "[0-9]*", 
                                        }}  disabled={isPending} onInput={handleTelInput} />
                                        {errors.phone && <FormHelperText>{errors.phone.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                        onClick={handleCancel}
                        disabled={isPending || !isDirty}
                        variant="text" 
                    >
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