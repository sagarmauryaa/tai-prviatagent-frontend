'use client';
import * as React from "react";
import { Option } from "@/components/core/option";
import { Box, Button, Card, CardContent, FormControl, FormHelperText, Input, InputLabel, OutlinedInput, Select, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/core/toaster";
import { FileDropzone } from "@/components/core/file-dropzone";

const schema = zod.object({
    data_type: zod.string().min(1, "Please select a data type"),
    pdf_url: zod.string().url("Please enter a valid URL").optional().nullable(),
    text: zod.string().min(1, "Please enter some text").optional().nullable(),
    pdf_file: zod.any().optional().nullable(),
}).refine((data) => {
    if (data.data_type === 'text' && !data.text) {
        return false;
    }
    if (data.data_type === 'pdf_url' && !data.pdf_url) {
        return false;
    }
    return true;
}, {
    message: "Required field missing for selected data type",
});

const defaultValues = {
    data_type: "text",
    pdf_url: "",
    text: "",
    pdf_file: null
}

const ChatDataForm = () => {
    const router = useRouter();
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues,
        resolver: zodResolver(schema)
    });

    const dataType = watch('data_type');

    const onSubmit = React.useCallback(async (data) => {
        try {
            if (data.data_type === 'pdf_upload' && data.pdf_file) {
                // const base64File = await fileToBase64(data.pdf_file[0]);
                data.pdf_file = '';
            }
            console.log('Submitted data:', data);
            toast.success("Data added successfully");
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        }
    }, [router]);

    const handleFileUpload = React.useCallback(
        async (files) => {
            if (files && files.length > 0) {
                setValue("pdf_file", files);
            }
        },
        [setValue]
    );

    return (
        <Box sx={{ position: 'sticky', bottom: 20, minHeight: '100px', display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Card sx={{ minHeight: '100px', maxWidth: '700px', width: '100%' }}>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            name="text"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.text)} fullWidth>
                                    <Input
                                        multiline
                                        rows={4}
                                        placeholder="Enter your data"
                                        {...field}
                                    />
                                    {errors.text && <FormHelperText>{errors.text.message}</FormHelperText>}
                                </FormControl>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ height: 38, mt: 'auto', mb: '2px', width: 'fit-content' }}
                        >
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ChatDataForm