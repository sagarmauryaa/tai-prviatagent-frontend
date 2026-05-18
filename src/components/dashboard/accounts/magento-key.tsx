"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { ContentCopy, Visibility, VisibilityOff, Key } from "@mui/icons-material";
import { useAuth } from "@/components/auth/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getMagentoConfig, updateMagentoConfig } from "@/utils/backend-endpoints";
import { toast } from "sonner";
import { Alert, CircularProgress, FormHelperText } from "@mui/material";
import crypto from "crypto";

const domainOrIpRegex =
    /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$|^(?:\d{1,3}\.){3}\d{1,3}$|^\[?([a-fA-F0-9:]+)\]?$/;


const schema = zod.object({
    domains: zod.string()
        .min(1, { message: "Please enter at least one domain" })
        .refine(
            (val) =>
                val
                    .split(",")
                    .map((d) => d.trim())
                    .every((d) => domainOrIpRegex.test(d)),
            {
                message: "One or more domains are invalid (use commas to separate)",
            }
        ),
});

type FormValues = zod.infer<typeof schema>;

export function MagentoKey() {
    const auth = useAuth();
    const router = useRouter();
    const { user } = auth;
    const [isPending, setIsPending] = React.useState(false);
    const [apiKey, setApiKey] = React.useState<string>("");
    const [showApiKey, setShowApiKey] = React.useState(false);

    const defaultValues: FormValues = {
        domains: "",
    };

    const {
        control,
        handleSubmit,
        setError,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const handleCancel = () => {
        reset(defaultValues);
        setApiKey("");
    };

    // Generate API Key (for demo we create a random string)
    const fetchConfig = async () => {
        try {
            setIsPending(true);
            const { data, status } = await getMagentoConfig();


            if (status === 200) {
                const { apiKey, allowedDomains } = data.data;

                setApiKey(apiKey || "");
                setValue('domains', (allowedDomains || []).join(", "));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load config");
        } finally {
            setIsPending(false);
        }
    };
    const handleGenerateKey = async () => {
        try {
            setIsPending(true);

            const newKey = generateApiKey();

            // hit backend and store new API key
            const { data, status } = await updateMagentoConfig({ apiKey: newKey });

            if (status === 200) {
                setApiKey(newKey); // keep in state so UI shows it
                toast.success("New API key generated & saved");
            } else {
                throw new Error("Failed to save API key");
            }
        } catch (error) {
            console.error(error);
            toast.error("Could not generate API key");
        } finally {
            setIsPending(false);
        }
    };
    const generateApiKey = (): string => {
        const raw = crypto.randomBytes(16).toString("hex");

        return [
            raw.substring(0, 8),
            raw.substring(8, 12),
            raw.substring(12, 16),
            raw.substring(16, 20),
            raw.substring(20, 32)
        ].join("-");
    };
    const handleCopyKey = () => {
        navigator.clipboard.writeText(apiKey);
        toast.success("API key copied to clipboard");
    };

    const onSubmit = React.useCallback(
        async (data: FormValues) => {
            if (!data.domains) {
                toast.error("Please fill in all required fields");
                return;
            }

            try {
                setIsPending(true);
                const { data: response, status } = await updateMagentoConfig(data);

                if (status === 200) {
                    toast.success("Profile updated successfully");
                } else {
                    throw new Error("Update failed");
                }
            } catch (error) {
                console.error(error);
                toast.error(
                    error instanceof Error ? error.message : "Failed to update profile"
                );
                setError("root", {
                    message: "Failed to update profile. Please try again later.",
                });
            } finally {
                setIsPending(false);
            }
        },
        [auth, router, setError, apiKey]
    );

    React.useEffect(() => {
        fetchConfig();
    }, [user]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader title="Magento Configuration" />
                <CardContent>
                    <Stack spacing={3}>
                        {/* Generate & Show API Key */}
                        <Stack spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<Key />}
                                onClick={handleGenerateKey}
                                disabled={isPending}
                                sx={{ width: 'fit-content', ml: 'auto' }}
                            >
                                Generate New API Key
                            </Button>

                            {apiKey && (
                                <FormControl>
                                    <InputLabel>API Key</InputLabel>
                                    <OutlinedInput
                                        type={showApiKey ? "text" : "password"}
                                        value={apiKey}
                                        readOnly
                                        endAdornment={
                                            <>
                                                <IconButton
                                                    onClick={() => setShowApiKey(!showApiKey)}
                                                    edge="end"
                                                >
                                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                                <IconButton onClick={handleCopyKey} edge="end">
                                                    <ContentCopy />
                                                </IconButton>
                                            </>
                                        }
                                    />
                                </FormControl>
                            )}
                        </Stack>

                        {/* Allowed Domains */}
                        <Stack spacing={2}>
                            <Controller
                                control={control}
                                name="domains"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.domains)}>
                                        <InputLabel required>Allowed Domain</InputLabel>
                                        <OutlinedInput placeholder="domain.com" {...field} disabled={isPending} />
                                        <FormHelperText>
                                            Enter one or more domains, separated by commas (e.g. example.com, test.com)
                                        </FormHelperText>
                                        {errors.domains && (
                                            <FormHelperText>
                                                {errors.domains.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                            {errors.root && (
                                <Alert severity="error">{errors.root.message}</Alert>
                            )}
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
                        startIcon={
                            isPending && <CircularProgress size={20} color="inherit" />
                        }
                    >
                        {isPending ? "Saving..." : "Save changes"}
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}
