"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CardActions, CircularProgress, FormControl, FormHelperText, OutlinedInput } from "@mui/material";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { mailCode } from "@/utils/backend-endpoints";
import { toast } from "sonner";

const schema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    code: z.string(),
});

type FormValues = z.infer<typeof schema>;

const MailCode = ({ code }: { code: string }) => {
    const [isPending, setIsPending] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: { email: "", code: "" },
        resolver: zodResolver(schema),
    });

    const onSubmit = async (formData: FormValues) => {
        try {
            setIsPending(true);
            const { data, status } = await mailCode({ email: formData.email, code: formData.code });

            if (status === 200) {
                toast.success("Code sent successfully. Please check your email.");
                setValue("code", "");
            } else if (status === 400) {
                setError("email", { message: data.message });
            }
        } catch (error) {
            toast.error("An error occurred while sending the code. Please try again later.");
            console.error("Error sending code:", error);
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        if (code) {
            setValue("code", code);
        }
    }, [code, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardActions sx={{ alignItems: "center", gap: 2 }} className="form-email-verification" >
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.email)}>
                            <OutlinedInput
                                type="email"
                                placeholder="Enter a valid Email"
                                {...field}
                                disabled={isPending}
                            />
                            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                        </FormControl>
                    )}
                /> 
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                >
                    {isPending ? "Sending..." : "Send Code"}
                </Button>
            </CardActions>
        </form>
    );
};

export default MailCode;
