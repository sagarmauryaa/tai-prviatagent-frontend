"use client";
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { useState } from 'react';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { toast } from 'sonner';

const AddProject = () => {
    const [open, setOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setProjectName('');
    };

    // Stub — wire up to real API when ready
    const handleAddProject = async () => {
        if (!projectName.trim()) {
            toast.error('Please enter a project name');
            return;
        }

        setIsPending(true);
        try {
            // TODO: replace with real API call, e.g.:
            // await addBrandInstance({ name: projectName });
            console.log('Adding project:', projectName);
            toast.success(`Project "${projectName}" added successfully`);
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add project. Please try again.');
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
                Add Project
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1, pr: 6 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Add New Project
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Enter a name for your new project.
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
                        <TextField
                            type="text"
                            label="Project Name"
                            placeholder="Enter a name for your new project"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                            disabled={isPending}
                            autoFocus
                            fullWidth
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} color="inherit" disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddProject}
                        variant="contained"
                        disabled={isPending || !projectName.trim()}
                    >
                        {isPending ? 'Adding...' : 'Add Project'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddProject;
