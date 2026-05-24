"use client";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useState } from 'react';
import { toast } from 'sonner';
import { createUser } from '@/utils/backend-endpoints';
import SelectProjectField from '@/components/dashboard/users/SelectProjectField';

interface FormState {
    fullName: string;
    username: string;
    password: string;
    role: 'ADMIN' | 'USER';
    projects: string[];
}

const DEFAULT_FORM: FormState = {
    fullName: '',
    username: '',
    password: '',
    role: 'USER',
    projects: [],
};

const AddUser = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);

    const handleClose = () => {
        setOpen(false);
        setForm(DEFAULT_FORM);
        setShowPassword(false);
    };

    const handleChange = (field: keyof FormState) => (value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateUser = async () => {
        if (!form.username.trim()) {
            toast.error('Username is required');
            return;
        }
        if (!form.password.trim()) {
            toast.error('Password is required');
            return;
        }

        setIsPending(true);
        try {
            const payload = {
                username: form.username,
                pass: form.password,
                role: form.role,
                fullName: form.fullName || undefined,
                ...(form.role === 'USER' ? { projects: form.projects } : {}),
            };

            const response = await createUser(payload);
            if (response.data.success) {
                toast.success(`User "${form.username}" created successfully`);
                handleClose();
            } else {
                if (response.data.errors.length > 0) {
                    toast.error(response.data.errors[0].msg);
                } else {
                    toast.error(response.data.error);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to create user. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="contained"
                startIcon={<PlusIcon weight="bold" />}
            >
                Add User
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1, pr: 6 }}>
                    <Typography variant="h6" fontWeight={700}>Add New User</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Create a new user with optional project assignment.
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12 }}
                    >
                        <XIcon size={18} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: '12px !important' }}>
                    <Stack spacing={3}>
                        {/* Username + Password + Admin row */}
                        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start"> */}
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Full Name"
                                placeholder="e.g. John Doe"
                                value={form.fullName}
                                onChange={(e) => handleChange('fullName')(e.target.value)}
                                disabled={isPending}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Username"
                                placeholder="e.g. john_doe"
                                value={form.username}
                                onChange={(e) => handleChange('username')(e.target.value.toLowerCase())}
                                disabled={isPending}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => handleChange('password')(e.target.value)}
                                disabled={isPending}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setShowPassword((s) => !s)}
                                                edge="end"
                                            >
                                                {showPassword
                                                    ? <EyeSlashIcon size={18} />
                                                    : <EyeIcon size={18} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* </Stack> */}


                        {/* Assign to Projects */}
                        <Divider />
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                px: 2,
                                py: 1.5,
                                borderRadius: 1.5,
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : theme.palette.divider}`,
                                background: form.role === 'ADMIN'
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : isDark ? 'rgba(255,255,255,0.02)' : theme.palette.background.default,
                                transition: 'background 0.2s',
                            }}
                        >
                            <Box>
                                <Typography variant="body2" fontWeight={600}>Administrator</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Full access to all projects and settings
                                </Typography>
                            </Box>
                            <Checkbox
                                size="small"
                                checked={form.role === 'ADMIN'}
                                onChange={(e) => {
                                    const role = e.target.checked ? 'ADMIN' : 'USER';
                                    setForm((prev) => ({
                                        ...prev,
                                        role,
                                        projects: role === 'ADMIN' ? [] : prev.projects,
                                    }));
                                }}
                                disabled={isPending}
                            />
                        </Stack>

                        {form.role !== 'ADMIN' && (
                            <SelectProjectField
                                value={form.projects}
                                onChange={(projects) => handleChange('projects')(projects)}
                                disabled={isPending}
                            />
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} color="inherit" disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateUser}
                        variant="contained"
                        disabled={isPending || !form.username.trim() || !form.password.trim()}
                    >
                        {isPending ? 'Creating...' : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddUser;
