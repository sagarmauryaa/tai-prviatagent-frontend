"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { Password as PasswordIcon } from "@phosphor-icons/react/dist/ssr/Password";
import { Alert, CircularProgress, FormHelperText } from "@mui/material";
import { z as zod } from "zod";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/utils/backend-endpoints";

const schema = zod.object({
    userId: zod.string().min(1, { message: "User ID is required" }),
    oldPassword: zod.string().min(1, { message: "Old password is required" }),
    newPassword: zod.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: zod.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormValues = zod.infer<typeof schema>;

export function PasswordForm() {
    const auth = useAuth();
    const router = useRouter();
    const { user } = auth;
    const [isPending, setIsPending] = React.useState(false);

    const defaultValues: FormValues = {
        userId: user?.userId ?? '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
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
        if (!data.userId || !data.newPassword || !data.confirmPassword) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsPending(true);
            const { data: response, status } = await resetPassword(data);

            if (status === 200) {
                const { userId, lastName, firstName, email, phone, token } = response.data; 
                auth.setUser({ userId, lastName, firstName, email, phone });
                Cookies.set('access_token', token);
                toast.success('Profile updated successfully');
                router.refresh();
            } else {
                throw new Error('Update failed');
            }
        } catch (error: any) {
            setError('root', {
                message: error?.message || 'Failed to update'
            });
            setIsPending(false);
        } finally {
            setIsPending(false);
        }
    }, [auth, router, setError, setIsPending]);

    React.useEffect(() => {
        reset(defaultValues);
    }, [user, reset]);


    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <Card>
                <CardHeader
                    avatar={
                        <Avatar>
                            <PasswordIcon fontSize="var(--Icon-fontSize)" />
                        </Avatar>
                    }
                    title="Change password"
                />
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={3}>
                            <Controller
                                control={control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.oldPassword)}>
                                        <InputLabel required>Old password</InputLabel>
                                        <OutlinedInput {...field} disabled={isPending} type="password" />
                                        {errors.oldPassword && <FormHelperText>{errors.oldPassword.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.newPassword)}>
                                        <InputLabel required>New password</InputLabel>
                                        <OutlinedInput {...field} disabled={isPending} type="password" />
                                        {errors.newPassword && <FormHelperText>{errors.newPassword.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.confirmPassword)}>
                                        <InputLabel required>Re-type new password</InputLabel>
                                        <OutlinedInput {...field} disabled={isPending} type="password" />
                                        {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <FormHelperText>
                                Password must contain at least:
                                <ul style={{ margin: '4px 0' }}>
                                    <li>8 characters</li>
                                    <li>One uppercase letter</li>
                                    <li>One lowercase letter</li>
                                    <li>One number</li>
                                    <li>One special character</li>
                                </ul>
                            </FormHelperText>
                            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                        </Stack>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending || !isDirty}
                                startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                            >
                                {isPending ? 'Updating...' : 'Update'}
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </form>

    );
}