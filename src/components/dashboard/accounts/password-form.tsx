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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeMyPassword } from "@/utils/backend-endpoints";

const schema = zod.object({
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
    const [isPending, setIsPending] = React.useState(false);

    const defaultValues: FormValues = {
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
        try {
            setIsPending(true);
            const { status } = await changeMyPassword({
                old: data.oldPassword,
                new: data.newPassword
            });

            if (status === 200) {
                toast.success('Password updated successfully');
                reset(defaultValues);
            } else {
                throw new Error('Update failed');
            }
        } catch (error: any) {
            console.error(error);
            setError('root', {
                message: error?.message || 'Failed to update password. Please verify your old password.'
            });
            toast.error('Failed to update password');
        } finally {
            setIsPending(false);
        }
    }, [reset, setError]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                                        <OutlinedInput {...field} label="Old password" disabled={isPending} type="password" />
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
                                        <OutlinedInput {...field} label="New password" disabled={isPending} type="password" />
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
                                        <OutlinedInput {...field} label="Re-type new password" disabled={isPending} type="password" />
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
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button onClick={handleCancel} disabled={isPending || !isDirty} variant="text">
                                Cancel
                            </Button>
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