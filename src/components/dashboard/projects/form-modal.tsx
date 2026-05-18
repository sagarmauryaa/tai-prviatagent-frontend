'use client';
import { Alert, Autocomplete, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Chip, CircularProgress, FormControl, FormControlLabel, FormHelperText, IconButton, InputLabel, MenuItem, Modal, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/core/toaster";
import { useAuth } from '@/components/auth/auth-context';
import { addBrandInstance, addInfoDataPDFURL, getAreaData, getBusinessCategories, updateBrandInstance } from '@/utils/backend-endpoints';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { Grid } from "@mui/system";
import { FileDropzone } from '@/components/core/file-dropzone';
import { TimePicker } from '@mui/x-date-pickers';
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { CloudArrowUp as CloudArrowUpIcon } from "@phosphor-icons/react/dist/ssr/CloudArrowUp";
import { Lightbulb, LightbulbOutlined } from '@mui/icons-material';

const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 500KB in bytes 

const schema = z.object({
    brand_logo: z.instanceof(File)
        .refine((file) => file.size > 0, { message: "Please select a file." })
        .refine((file) => {
            const validTypes = [
                "image/png", "image/jpeg"
            ];
            return validTypes.includes(file.type);
        }, { message: "Invalid file type. Only images (PNG, JPG, JPEG)" })
        .optional(),
    name: z.string().trim().min(1, { message: "Please enter name" })
});

interface InstanceFormTypes { open: boolean, handleModal: (status: boolean) => void, handleFetch: () => Promise<void>, data?: any }


const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '700px',
    width: '100%',
    padding: '0 15px',
    outline: 'none',
};
interface FormDataTypes {
    _id?: string;
    brand_logo?: File | undefined;
    name?: string;
}

const defaultValues: Partial<FormDataTypes> = {
    brand_logo: undefined, // Ensures correct typing
    name: "",
};

interface OptionType {
    value?: string;
    label: string;
}

const openHoursDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends'];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const InstanceForm: React.FC<InstanceFormTypes> = ({ open, handleModal = () => { }, data = null, handleFetch }) => {
    const router = useRouter();
    const { user, getBrands, setLoading } = useAuth();
    const [isPending, setIsPending] = useState(false);
    // const [businessCategories, setBusinessCategories] = useState<OptionType[]>([]);
    // const [countries, setCountries] = useState<OptionType[]>([]);
    // const [states, setStates] = useState<OptionType[]>([]);
    const [brandLogo, setBrandLogo] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const { currentSubscription } = useAuth();

    const { control, handleSubmit, setError, setValue, getValues, clearErrors, formState: { errors }, reset } = useForm({
        defaultValues,
        resolver: zodResolver(schema)
    });


    const onSubmit = useCallback(async (formData: Partial<FormDataTypes>) => {
        if (!user?.userId) {
            toast.error("Fill required field!");
            return;
        }
        setIsPending(true);


        try {
            if (!formData.name) {
                toast.error("Required fields are missing");
                setIsPending(false);
                return;
            }
            const payload = {
                name: formData.name!,
                brand_logo: formData.brand_logo || undefined
            } as const;

            const apiResponse = data?._id ?
                await updateBrandInstance(data._id, payload) :
                await addBrandInstance(payload);

            if (apiResponse.status === 200) {
                setIsPending(false);
                reset(defaultValues);
                handleModal(false);
                getBrands();
                await handleFetch();
                toast.success(`Brand instance ${data?._id ? "updated" : "added"} successfully`);
                setLoading(false);
            }
        } catch (error: any) {
            setIsPending(false);
            console.error(error);
            setError('root', {
                message: error?.message || 'Failed to login'
            });
            toast.error("Something went wrong!");
        }
    }, [user, handleModal, handleFetch, data, reset]);

    useEffect(() => {
        reset(defaultValues)

        if (data) {

            setBrandLogo(data?.profileImg ? `https://s3-us-west-2.amazonaws.com/tellofystaging/${data?.profileImg}` : '')
            setValue('_id', data?._id);
            setValue('name', data?.name);
            // if (data?.openingHours && data?.openingHours.length == 1 && data?.openingHours[0]) {
            //     const { day, openingTime, closingTime } = data?.openingHours[0]
            //     setValue('openingDays', day.split(',') ?? []);
            //     setValue('openingTime', openingTime && dayjs(openingTime, 'HH:mm A'))
            //     setValue('closingTime', closingTime && dayjs(closingTime, 'HH:mm A'))
            // }
        }
        else {
            setBrandLogo('');
        }
    }, [open, data]);

    const handleFileUpload = useCallback(
        (files: File[]) => {
            if (!files?.length) {
                toast.error("No file selected.");
                return;
            }

            const file = files[0];

            const fileTypeMap: Record<string, "image" | undefined> = {
                "image/jpeg": "image",
                "image/png": "image",
            };

            const fileType = fileTypeMap[file.type];

            if (!fileType) {
                toast.error("Invalid file type. Only PNG, JPG, or JPEG images are allowed.");
                return;
            }
            else {
                clearErrors('brand_logo')
                setValue("brand_logo", file);
            }
        },
        [setValue]
    );

    // const getBusinessCatgeories = async () => {
    //     try {
    //         const response = await getBusinessCategories();
    //         if (response.status !== 200) {
    //             toast.error("Something went wrong!");
    //             return;
    //         }
    //         const data = response.data.data;
    //         const finalData = data.map((country: any) => ({
    //             value: country.id,
    //             label: country.name,
    //         }));
    //         setBusinessCategories(finalData);
    //     }
    //     catch (error) {
    //         console.error("Error fetching countries:", error);
    //         return [];
    //     }
    // }; 

    // useEffect(() => {
    //     if (businessCategories.length === 0) {
    //         getBusinessCatgeories()
    //     }
    //     if (countries.length === 0) {
    //         const getCountry = async () => {
    //             const { data, status } = await getAreaData();
    //             if (status === 200) {
    //                 // const finalData = data.data;
    //                 const finalData = data.data.map((d: any) => ({
    //                     value: d.code,
    //                     label: d.name,
    //                 }));
    //                 setCountries(finalData);
    //             }
    //         }
    //         getCountry();
    //     }
    // }, [businessCategories]);

    return (
        <Modal
            open={open}
            onClose={() => { handleModal(false); clearErrors(); reset(defaultValues) }
            }

            aria-labelledby="form-modal"
        >
            <Box sx={MODAL_STYLE}  >
                <Card sx={{ width: '100%', maxHeight: '80vh', overflow: 'auto', position: 'relative' }}>
                    {
                        formLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', width: "100%" }}>
                            <CircularProgress data-title sx={{ display: 'inline-block', height: '100%', width: "100%" }} />
                        </Box> :
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <CardContent>
                                    <Stack spacing={3}>
                                        <Typography className="modal-heading" variant="h5">{data ? 'Edit' : 'Add'} Instance</Typography>
                                        {
                                            currentSubscription?.allowAvatar && (brandLogo && brandLogo != '' ? <Box
                                                sx={{
                                                    border: `1px solid var(--mui-palette-divider)`,
                                                    borderRadius: 1,
                                                    p: 2,
                                                }}
                                            >
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: "var(--mui-palette-background-paper)",
                                                            color: "var(--mui-palette-text-primary)",
                                                        }}
                                                    >
                                                        <CloudArrowUpIcon />
                                                    </Avatar>
                                                    <Stack spacing={1} direction="row" alignItems="center" justifyContent={"space-between"} flex={1}>
                                                        <Typography variant="body2">
                                                            <a target='_blank' href={brandLogo} >
                                                                {brandLogo.split('/').pop() || ''}
                                                            </a>
                                                        </Typography>
                                                        <IconButton onClick={() => setBrandLogo('')} size="small">
                                                            <XIcon />
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                                : <Controller
                                                    control={control}
                                                    name="brand_logo"
                                                    render={({ field: { onChange, value, ...field } }) => (
                                                        <FormControl error={Boolean(errors.brand_logo)} fullWidth>
                                                            <InputLabel sx={{ mb: 1 }}>Brand Logo</InputLabel>
                                                            <FileDropzone
                                                                acceptedFiles={{
                                                                    'image/png': ['.png'],
                                                                    'image/jpeg': ['.jpg', '.jpeg'],
                                                                }}
                                                                defaultFiles={value ? [value as File] : []}
                                                                maxSize={MAX_FILE_SIZE}
                                                                caption="Upload brand logo in PNG/JPG format (140x140 pixels, max 500KB)"
                                                                onDrop={handleFileUpload}
                                                                {...field}
                                                            />
                                                            {errors.brand_logo && (
                                                                <FormHelperText error>
                                                                    {errors.brand_logo.message as string}
                                                                </FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    )}
                                                />)
                                        }

                                        <Controller
                                            control={control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormControl error={Boolean(errors.name)} fullWidth>
                                                    <InputLabel required>Entity Name</InputLabel>
                                                    <OutlinedInput
                                                        // disabled={data}
                                                        placeholder="Enter Entity Name"
                                                        {...field}
                                                        inputProps={{
                                                            maxLength: 255,
                                                        }}
                                                    />
                                                    {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                                                </FormControl>
                                            )}
                                        />

                                        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

                                        <Card variant='outlined' style={{ backgroundColor: '#e5d8ff', borderColor: 'none' }}>
                                            <CardContent sx={{display:'flex', flexDirection:'row', gap:1}}>
                                                <LightbulbOutlined sx={{fontSize:18, mt:0.5}} />
                                                <Stack>
                                                    <Typography variant='subtitle1' sx={{ mb: 1 }}>What's a Instance ?</Typography>
                                                    <Typography variant='body1' style={{ lineHeight: '1.4', fontSize: '12px' }}>Instances are like projects which have their own isolated chats, files, and data associated.  Data is not shared across instances, which means you can create one instance for your customer support and add all customer support data, FAQs to that instance and expose that for querying. Another instance can be created for your web site visitors and all the web site data can be added.  This will allow web visitors to interact and ask questions on that data. You can even create a personal instance for your friends and family.  Instances are exposed by the Chat Bubble Link ( Try it now Menu). Use Instances  to keep things tidy, clean and with isolated data sets. </Typography>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Stack >
                                </CardContent>
                                <CardActions sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1, borderTop: '1px solid #e0e0e0' }}>
                                    <Button
                                        type="button"
                                        sx={{ width: 'fit-content', ml: 'auto' }}
                                        variant="text"
                                        onClick={() => { handleModal(false); clearErrors(); reset(defaultValues) }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        sx={{ width: 'fit-content', ml: 'auto' }}
                                        variant="contained"
                                        disabled={isPending}
                                        startIcon={isPending && <CircularProgress size={20} color="inherit" />}
                                    >
                                        {isPending ? "Submitting..." : "Submit"}
                                    </Button>
                                </CardActions>
                            </form>
                    }
                </Card >
            </Box>
        </Modal>
    )
}

export default InstanceForm