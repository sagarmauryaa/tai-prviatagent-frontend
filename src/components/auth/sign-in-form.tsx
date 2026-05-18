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
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import Cookies from 'js-cookie'
import { useAuth } from "@/components/auth/auth-context";
import { DynamicLogo } from "@/components/core/logo";
import { toast } from "@/components/core/toaster";
import { LoginDashboard } from "@/utils/backend-endpoints";
import { CircularProgress } from "@mui/material";
import { paths } from "@/paths";
import { APP_ENV } from "@/utils/config";

const schema = zod.object({
    email: zod.string().min(1, { message: "Email is required" }).email(),
    password: zod.string().min(1, { message: "Password is required" }),
});

const defaultValues = { email: "", password: "" };

export function SignInForm() {
    const router = useRouter();
    const auth = useAuth();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [isPending, setIsPending] = React.useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ defaultValues, resolver: zodResolver(schema) });


    const onSubmit = React.useCallback(
        async (body: { email: string, password: string }) => {
            try {
                setIsPending(true);
                const { data, status } = await LoginDashboard(body);

                if (status === 200) {
                    const { userId, lastName, firstName, email, phone, token, brands, subscription } = data?.data;
                    auth.setUser({ userId, lastName, firstName, email, phone });
                    if (brands.length > 0) {
                        auth.setBrands(brands);
                        auth.setSelectedBrand(brands[0]);
                    }
                    if (subscription) {
                        if (typeof subscription === 'string' && subscription === "Activeted free plan") {
                            // router.refresh();
                            window.location.reload();
                        } else {
                            auth.setCurrentSubscription(subscription)
                        }
                    }
                    Cookies.set('access_token', token)
                    router.refresh();
                } else {
                    setIsPending(false);
                    toast.error('Please try again later.');
                    setError('root', {
                        message: 'Invalid Crediential'
                    });
                    return;
                }
            } catch (error: any) {
                // setError('root', {
                //     message: error?.message || 'Failed to login'
                // });
                setError('root', {
                    message: 'Failed to login'
                });
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
                <Typography variant="h5">Sign in</Typography>
                <Typography color="text.secondary" variant="body2">
                    Don&apos;t have an account?{" "}
                    <a href={APP_ENV === 'staging' ? "https://stage.tellofy.ai/signup-for-tai-from-tellofy-ai-your-own-voice-enabled-ai-agent-grounded-on-your-data-only/" : "https://tellofy.ai/free-signup-for-tai/"} target="_blank">
                        Sign up
                    </a>
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
                            <Controller
                                control={control}
                                name="password"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.password)}>
                                        <InputLabel>Password</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            endAdornment={
                                                showPassword ? (
                                                    <EyeIcon
                                                        cursor="pointer"
                                                        fontSize="var(--icon-fontSize-md)"
                                                        onClick={() => {
                                                            setShowPassword(false);
                                                        }}
                                                    />
                                                ) : (
                                                    <EyeSlashIcon
                                                        cursor="pointer"
                                                        fontSize="var(--icon-fontSize-md)"
                                                        onClick={() => {
                                                            setShowPassword(true);
                                                        }}
                                                    />
                                                )
                                            }
                                            type={showPassword ? "text" : "password"}
                                        />
                                        {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                            <Button disabled={isPending} type="submit" variant="contained" startIcon={isPending && <CircularProgress size={20} color="inherit" />}>
                                Sign in
                            </Button>
                        </Stack>
                    </form>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Forgot your password?
                        </Typography>
                        <Link
                            component={RouterLink}
                            href={paths.auth.resetPassword}
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                '&:hover': {
                                    textDecoration: 'none',
                                }
                            }}
                        >
                            Reset Password
                        </Link>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}