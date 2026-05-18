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
import Cookies from 'js-cookie';
import { useAuth } from "@/components/auth/auth-context";
import { DynamicLogo } from "../core/logo";
import { paths } from "@/paths";
import { authenticatePassToken, setPassword } from "@/utils/backend-endpoints";
import { decryptId } from "@/utils/hs-decryption";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

const schema = zod.object({
    userId: zod.string(),
    password: zod.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: zod.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
type FormValues = zod.infer<typeof schema>;

const defaultValues = { userId: "", password: "", confirmPassword: "" };

export function SetPassword({ token }: { token: string }) {
    const router = useRouter();
    const auth = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);
    const [user, setUser] = React.useState<{ _id?: string }>({});
    const [isPending, setIsPending] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm({ defaultValues, resolver: zodResolver(schema) });
    const onSubmit = React.useCallback(async (data: FormValues) => {

        if (!data.userId || !data.password || !data.confirmPassword) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsPending(true);
            const { data: response, status } = await setPassword(data);

            if (status === 200) {
                toast.success('Password updated successfully');
                router.push(paths.auth.signIn);
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


    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const checkLeadStatus = async (token: string) => {
        if (token && token != 'undefined') {
            setLoading(true);
            try {
                const { data, status } = await authenticatePassToken(token);
                if (status === 200) { 

                    setUser(data?.data);
                    setValue("userId", data?.data._id)
                } else {
                    return null;
                }
            } catch (error: any) {
                return null;
            }
            finally {
                setLoading(false);
            }
        }
    }

    React.useEffect(() => {

        if (token) {
            Cookies.remove('access_token');
            const encodedUrl = encodeURIComponent(token);
            const decodedToken = decryptId(encodedUrl);
            checkLeadStatus(decodedToken);
        }
    }, [token])

    if (user && user?._id) {
        return (
            <Stack spacing={4}>
                <div>
                    <Box component={RouterLink} href={paths.home} sx={{ display: "inline-block", fontSize: 0 }}>
                        <DynamicLogo colorDark="dark" colorLight="light" height={40} width={128} />
                    </Box>
                </div>
                <Stack spacing={1}>
                    <Typography variant="h5">Set Password</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Please set your password
                    </Typography>
                </Stack>
                <Stack spacing={3}>
                    <Stack spacing={2}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.password)}>
                                            <InputLabel required>Password</InputLabel>
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
                                <Controller
                                    control={control}
                                    name="confirmPassword" // Changed from "password" to "confirmPassword"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.confirmPassword)}>
                                            <InputLabel required>Confirm Password</InputLabel>
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
                                            {errors.confirmPassword ? (
                                                <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
                                            ) : null}
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
                                {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isPending}
                                    startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                                >
                                    {isPending ? 'Updating...' : 'Set Password'}
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Stack>
            </Stack>
        );
    }
    else {
        return (

            <Stack spacing={4}>
                {
                    loading ?
                        <CircularProgress /> :
                        <>
                            <div>
                                <Box component={RouterLink} href={paths.home} sx={{ display: "inline-block", fontSize: 0 }}>
                                    <DynamicLogo colorDark="dark" colorLight="light" height={40} width={128} />
                                </Box>
                            </div>
                            <Stack spacing={1}>
                                <Typography variant="h5">Invalid Token</Typography>
                                <Typography color="text.secondary" variant="body2">
                                    Sorry, the link has been already used.
                                </Typography>
                            </Stack>
                        </>
                }
            </Stack>
        );
    }

}