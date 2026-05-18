'use client';
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, InputLabel, Modal, Stack, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/core/toaster";
import { useAuth } from '@/components/auth/auth-context';
import { addUploadCSVFile, getCSVFile, removedCSVFile } from '@/utils/backend-endpoints';
import { FileDropzone } from "@/components/core/file-dropzone";
import { useRouter } from 'next/navigation';
import { CloudArrowUp as CloudArrowUpIcon } from "@phosphor-icons/react/dist/ssr/CloudArrowUp";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import IconButton from "@mui/material/IconButton";
import UploadingProcessing from './uploading-processing';
import loading from '@/app/dashboard/loading';


const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes 

const schema = (dataSize: number) => zod.object({
    file: zod.custom<File | undefined | null>()
        .nullable()
        .refine((file) => file !== undefined && file != null, "Please select a CSV file")
        .refine((file) => {
            if (!file) return false;
            const fileSizeInMB = file.size; // Convert bytes to MB
            return fileSizeInMB <= dataSize;
        }).refine((file) => {
            const fileSizeInMB = file ? (file.size / (1024 * 1024)).toFixed(2) : 0;
            return `File size (${fileSizeInMB}MB) exceeds your remaining data limit (${dataSize.toFixed(2)}MB)`;
        })
        .refine((file) => {
            if (!file) return false;
            return file.size <= MAX_FILE_SIZE;
        }, "File is too large. Maximum size is 200MB")
        .refine(
            (file) => file ? file.type === "text/csv" || file.name.endsWith(".csv") : false,
            "Only CSV files are allowed"
        )
});

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

type FormValues = { file: File | undefined | null };

const defaultValues = {
    file: null
}

const CSVFileUploadForm = () => {
    const router = useRouter();
    const [csvFile, setCsvFile] = useState<{ file?: File | null, publicUrl?: string, dataSize?: number }>({})
    const { selectedBrand, user, currentSubscription, updateDataSize } = useAuth();
    const totalDatasize = useMemo(() => {
        return (currentSubscription?.totalDatasize ?? 0) * 1024 * 1024;
    }, [currentSubscription?.totalDatasize]);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        defaultValues,
        resolver: zodResolver(schema(totalDatasize))
    });

    const [isPending, setIsPending] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUploading, setIsUploading] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const remainingSize = currentSubscription
        ? currentSubscription.totalDatasize * (1024 * 1024) - currentSubscription.dataSize
        : 0;

    const handleFileUpload = React.useCallback(
        async (files: File[]) => {
            if (!currentSubscription) {
                toast.error("Subscription data not available");
                return;
            }
            try {
                if (!files || files.length === 0) {
                    toast.error("No file selected");
                    return;
                }

                const file = files[0];

                // Additional validations
                if (file.size === 0) {
                    toast.error("Empty file is not allowed");
                    return;
                }

                if (file.name.length > 255) {
                    toast.error("File name is too long");
                    return;
                }

                const remainingSize = totalDatasize - currentSubscription.dataSize;
                const fileSizeInMB = file.size;

                if (fileSizeInMB > remainingSize) {
                    toast.error(`File size exceeds remaining storage limit of ${remainingSize}MB`);
                    return;
                } else {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    setValue("file", dataTransfer.files[0]);
                }
            } catch (error) {
                console.error("File upload error:", error);
                toast.error("Error processing file");
            }
        },
        [setValue, currentSubscription, totalDatasize]
    );
    const abortController = React.useRef<AbortController | null>(null);

    const onSubmit = React.useCallback(async (data: FormValues) => {
        if (!user?.userId || !selectedBrand?._id || !data.file) {
            toast.error("Missing required information");
            return;
        }
        setIsUploading(true)

        
        setIsPending(true);

        // Create new AbortController for this upload
        abortController.current = new AbortController();

        try {
            const { data: response, status } = await addUploadCSVFile({
                userId: user.userId,
                brandId: selectedBrand._id,
                file: data.file,
                signal: abortController.current.signal
            });

            if (status === 200) {
                toast.success("File uploaded and processed successfully!");
                setValue('file', null);
                const result = response?.data;
                if (result?.fileUrl) {
                    const fileName = result.fileUrl.split('/').pop() || '';
                    setCsvFile({ file: new File([], fileName, { type: 'text/csv' }), publicUrl: result.publicUrl, dataSize: result.dataSize });
                }
                if (currentSubscription) {
                    const fileSize = data.file.size
                    updateDataSize(fileSize);
                }
            }
            else {
                throw new Error("Upload failed");
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                toast.info('Upload cancelled');
            } else {
                console.error("Upload error:", error);
                toast.error(error.message ?? "Upload failed");
            }
        } finally {
            abortController.current = null;
            setIsPending(false);
            setIsUploading(false);
        }
    }, [selectedBrand, currentSubscription, user, setValue, router]);

    const handleAbort = React.useCallback(() => {
        if (abortController.current) {
            toast.error("Upload cancelled");
            abortController.current.abort();
            abortController.current = null;
        }
    }, []);

    const getUploadedCSVFile = React.useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const { data, status } = await getCSVFile(id)
            if (status === 200) {
                const result = data?.data;
                if (result?.fileUrl) {
                    const fileName = result.fileUrl.split('/').pop() || '';
                    setCsvFile({ file: new File([], fileName, { type: 'text/csv' }), publicUrl: result.publicUrl, dataSize: result.dataSize });
                }
            }
        } catch (error: any) {
            // console.error('Error fetching brands:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [selectedBrand, setValue]);

    const handleRemoveFiles = React.useCallback(async () => {
        if (!selectedBrand?._id) {
            toast.error("Missing required information");
            return;
        }
        try {
            setIsPending(true);
            const { data, status } = await removedCSVFile(selectedBrand?._id)
            if (status === 200) {
                setCsvFile({});
                setIsPending(false);
                setModalOpen(false);

                if (csvFile.dataSize) {
                    updateDataSize(csvFile.dataSize, false);
                }
                toast.success("File deleted successfully!");
            }
        } catch (error: any) {
            console.error('Error fetching brands:', error);
        }
    }, [selectedBrand, setValue, csvFile]);




    useEffect(() => {
        if (selectedBrand) { getUploadedCSVFile(selectedBrand._id) }
    }, [selectedBrand])

    // useEffect(() => {
    //     if (csvFile) { setValue('file', csvFile) }
    // }, [csvFile])

    return (

        <>
        <Card className="adddata-content" >
            <form onSubmit={handleSubmit(onSubmit)}>
               
                <CardContent className="common-textarea">
                    {
                        isLoading ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                                <CircularProgress />
                            </Box>
                            :

                            <>
                                <Controller
                                    control={control}
                                    name="file"
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <FormControl error={Boolean(errors.file)} fullWidth> 
                                            {
                                                csvFile.file ?
                                                    <Box
                                                        sx={{
                                                            border: `1px solid ${errors.file ? 'red' : 'var(--mui-palette-divider)'}`,
                                                            borderRadius: 1,
                                                            p: 2,
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: "var(--mui-palette-background-paper)",
                                                                    color: errors.file ? 'red' : "var(--mui-palette-text-primary)",
                                                                }}
                                                            >
                                                                <CloudArrowUpIcon />
                                                            </Avatar>
                                                            <Stack spacing={1} flex={1}>

                                                                <Typography variant="body2">
                                                                    <a target='_blank' href={csvFile.publicUrl} >
                                                                        {csvFile.file.name}
                                                                    </a>
                                                                </Typography>

                                                            </Stack>
                                                            <IconButton onClick={() => setModalOpen(true)} size="small">
                                                                <XIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </Box> :
                                                    <FileDropzone
                                                        acceptedFiles={{
                                                            "text/csv": [".csv"],
                                                        }}

                                                        caption="CSV files only | Max 200MB"
                                                        onDrop={handleFileUpload}
                                                        {...field}
                                                        maxSize={MAX_FILE_SIZE}

                                                    />
                                            }
                                            {errors.file && (
                                                <FormHelperText error>
                                                    {errors.file.message as string}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                            </>}

                </CardContent>
                <CardActions sx={{justifyContent:'flex-end'}} className="add-data-cta">
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!modalOpen && isPending || csvFile.file != null || remainingSize <= 0}
                        startIcon={!modalOpen && isPending && <CircularProgress size={20} color="inherit" />}
                    >
                        {!modalOpen && isPending ? 'Uploading...' : 'Upload'}
                    </Button>
                </CardActions>
            </form>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="delete-confirmation-modal"
            >
                <Box sx={MODAL_STYLE}>
                    <Card sx={{ width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                Are you sure?
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                This information will be deleted. Are you sure this action cannot be undone.
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                <Button variant="text" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button disabled={isPending} startIcon={isPending && <CircularProgress size={20} color="inherit" />} variant="contained" onClick={handleRemoveFiles}>

                                    {isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
            <UploadingProcessing loading={isUploading} onCancel={handleAbort} />
        </Card>
        </>
    )
}

export default CSVFileUploadForm
