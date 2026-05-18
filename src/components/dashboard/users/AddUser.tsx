"use client";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
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

// ─── Mock project data (replace with real API data when ready) ────────────────
const MOCK_PROJECTS = [
    { id: 'proj-001', name: 'Magento Data' },
    { id: 'proj-002', name: 'EE_ProductCatalog' },
    { id: 'proj-003', name: 'EE_PDF_Catalog' },
    { id: 'proj-004', name: 'Support Knowledge Base' },
    { id: 'proj-005', name: 'Marketing Assets' },
];

interface Project { id: string; name: string; }

interface FormState {
    username: string;
    password: string;
    isAdmin: boolean;
    projects: Project[];
}

const DEFAULT_FORM: FormState = {
    username: '',
    password: '',
    isAdmin: false,
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

    // Stub — wire to real API when ready
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
            // TODO: replace with real API call, e.g.:
            // await createUser({ username: form.username, password: form.password, isAdmin: form.isAdmin, projectIds: form.projects.map(p => p.id) });
            console.log('Creating user:', form);
            toast.success(`User "${form.username}" created successfully`);
            handleClose();
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
                                label="Username"
                                placeholder="e.g. john_doe"
                                value={form.username}
                                onChange={(e) => handleChange('username')(e.target.value.toLowerCase())}
                                disabled={isPending}
                                autoFocus
                                fullWidth
                                size="small"
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
                                size="small"
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
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    fontWeight: 500,
                                    mb: 1,
                                    fontSize: '.9rem',
                                }}
                            >
                                Assign to Projects
                            </Typography>
                            <Autocomplete
                                multiple
                                options={MOCK_PROJECTS}
                                getOptionLabel={(option) => option.name}
                                value={form.projects}
                                onChange={(_, value) => handleChange('projects')(value)}
                                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                disabled={isPending}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={key}
                                                label={option.name}
                                                size="small"
                                                {...tagProps}
                                                sx={{
                                                    bgcolor: "primary.main",
                                                    color: "primary.contrastText",
                                                    fontWeight: 600,
                                                    fontSize: "0.72rem",
                                                    "& .MuiChip-deleteIcon": {
                                                        color: "primary.contrastText",
                                                        opacity: 0.7,
                                                        "&:hover": { opacity: 1 },
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        placeholder={form.projects.length === 0 ? 'Select projects...' : ''}
                                    />
                                )}
                            />
                        </Box>
                        {/* Admin row */}
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
                                background: form.isAdmin
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
                                checked={form.isAdmin}
                                onChange={(e) => handleChange('isAdmin')(e.target.checked)}
                                disabled={isPending}
                            />
                        </Stack>
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
