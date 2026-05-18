"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import Link from "@mui/material/Link";

import { useAuth } from "@/components/auth/auth-context";
import { DynamicLogo } from "../core/logo";
import { paths } from "@/paths";
import { forgotPassword } from "@/utils/backend-endpoints";
import { toast } from "sonner";
import { CircularProgress } from "@mui/material";

const schema = zod.object({
    email: zod.string().min(1, { message: "Email is required" }).email(),
})

const defaultValues = { email: "" };

export function ForgotPasswordForm() {
    const router = useRouter();
    const auth = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);

    const {
        control,
        handleSubmit,
        setError,
        resetField,
        formState: { errors },
    } = useForm({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (body: { email: string }) => {
            try {
                setIsPending(true);
                const { data, status } = await forgotPassword(body.email);

                if (status === 200) {
                    toast.success('Password reset instructions sent to your email');
                    router.refresh();
                    resetField('email');
                } else {
                    setError('root', {
                        message: 'Invalid Crediential'
                    });
                    return;
                }
            } catch (error: any) { 
                
                setError('root', {
                    message: error.message || 'Please try again later'
                });
                setIsPending(false);
            } finally { 
                setIsPending(false);
            }
        },
        [auth, router, setError]
    );


    return (
        <Stack spacing={4}>
            <div>
                <Box component={RouterLink} href={paths.home} sx={{ display: "inline-block", fontSize: 0 }}>
                    <DynamicLogo colorDark="dark" colorLight="light" height={40} width={128} />
                </Box>
            </div>
            <Stack spacing={1}>
                <Typography variant="h5">Forgot Password</Typography>
                <Typography color="text.secondary" variant="body2">
                    Please enter your email address to receive a password reset link
                </Typography>
            </Stack>
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.email)}>
                                        <InputLabel>Email address</InputLabel>
                                        <OutlinedInput {...field} type="email" />
                                        {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                            <Button disabled={isPending} type="submit" variant="contained" startIcon={isPending && <CircularProgress size={20} color="inherit" />}>
                                Reset Password
                            </Button>
                        </Stack>
                    </form>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Remember your password?
                        </Typography>
                        <Link
                            component={RouterLink}
                            href={paths.auth.signIn}
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                '&:hover': {
                                    textDecoration: 'none',
                                }
                            }}
                        >
                            Sign In
                        </Link>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}