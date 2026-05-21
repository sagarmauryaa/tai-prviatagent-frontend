"use client";

import * as React from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import RouterLink from "next/link";
import { useRouter } from 'next/navigation';
import { updateBrandInstance, deleteBrandInstance } from '@/utils/backend-endpoints';
import { paths } from "@/paths";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { FolderOpen as FolderOpenIcon } from "@phosphor-icons/react/dist/ssr/FolderOpen";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { UserPlus as UserPlusIcon } from "@phosphor-icons/react/dist/ssr/UserPlus";
import { Warning as WarningIcon } from "@phosphor-icons/react/dist/ssr/Warning";
import { CalendarBlank as CalendarIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { IdentificationCard as IdIcon } from "@phosphor-icons/react/dist/ssr/IdentificationCard";
import { toast } from "sonner";
import { addUserToInstance, removeUserFromInstance } from '@/utils/backend-endpoints';

// ─── Static mock data ─────────────────────────────────────────────────────────
const MOCK_PROJECT = {
    id: "d3c20c97-3e22-4120-9f25-2e60f583d140",
    name: "Magento Data",
    createdAt: "2026-05-07",
    files: 0,
};

const MOCK_USERS = [
    { id: "usr-001", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: "usr-002", name: "Bob Smith", email: "bob@example.com", role: "Member" },
];

const AVAILABLE_USERS = [
    { id: "usr-003", name: "Carol White", email: "carol@example.com" },
    { id: "usr-004", name: "David Lee", email: "david@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
    { id: "usr-005", name: "Eva Martin", email: "eva@example.com" },
];
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function avatarColor(id: string) {
    const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6"];
    const idx = id.charCodeAt(id.length - 1) % colors.length;
    return colors[idx];
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Box
            sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                background: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Box sx={{ color: "text.disabled", lineHeight: 0 }}>{icon}</Box>
            <Box>
                <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem" }}>
                    {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.25 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Rename Section ───────────────────────────────────────────────────────────
function RenameSection({ initialName, onRename }: { initialName: string; onRename?: (newName: string) => Promise<void> | void }) {
    const [editing, setEditing] = React.useState(false);
    const [value, setValue] = React.useState(initialName);
    const [saved, setSaved] = React.useState(initialName);

    const handleSave = async () => {
        if (!value.trim()) { toast.error("Project name cannot be empty"); return; }
        try {
            if (onRename) await onRename(value.trim());
            setSaved(value.trim());
            setEditing(false);
            toast.success("Project renamed successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to rename project");
        }
    };
    const handleCancel = () => { setValue(saved); setEditing(false); };

    return (
        <Box>
            <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.68rem", display: "block", mb: 1 }}>
                Project Name
            </Typography>
            {editing ? (
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
                        autoFocus
                        sx={{ minWidth: 240 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Save">
                                        <IconButton size="small" onClick={handleSave} color="primary">
                                            <CheckIcon size={16} weight="bold" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                        <IconButton size="small" onClick={handleCancel}>
                                            <XIcon size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            ) : (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{saved}</Typography>
                    <Tooltip title="Rename project">
                        <IconButton size="small" onClick={() => setEditing(true)} sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
                            <PencilIcon size={16} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )}
        </Box>
    );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────
function AddUserModal({
    open,
    onClose,
    assignedUsers,
    onAdd,
}: {
    open: boolean;
    onClose: () => void;
    assignedUsers: typeof MOCK_USERS;
    onAdd: (user: typeof AVAILABLE_USERS[0]) => void;
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [search, setSearch] = React.useState("");

    const filtered = AVAILABLE_USERS.filter(
        (u) =>
            !assignedUsers.find((a) => a.id === u.id) &&
            (u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()))
    );

    const handleClose = () => { setSearch(""); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ pr: 6 }}>
                <Typography variant="h6" fontWeight={700}>Add User to Project</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    Search and select a user to assign.
                </Typography>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{ position: "absolute", top: 12, right: 12 }}
                >
                    <XIcon size={18} />
                </IconButton>
            </DialogTitle>

            {/* Sticky search — sits outside the scroll area */}
            <Box
                sx={{
                    px: 3,
                    pt: 2,
                    pb: 1.5,
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "inherit",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    autoFocus
                />
            </Box>

            {/* Scrollable user list */}
            <Box sx={{ px: 2, py: 1.5, overflowY: "auto", maxHeight: 340 }}>
                {filtered.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.disabled"
                        sx={{ textAlign: "center", py: 3 }}
                    >
                        No users available to add
                    </Typography>
                ) : (
                    <Stack spacing={0.5}>
                        {filtered.map((u) => (
                            <Stack
                                key={u.id}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    px: 1.5, py: 1.25, borderRadius: 2,
                                    border: `1px solid transparent`,
                                    transition: "all 0.15s",
                                    "&:hover": {
                                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                                        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar sx={{ width: 34, height: 34, fontSize: "0.75rem", bgcolor: avatarColor(u.id) }}>
                                        {getInitials(u.name)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                    </Box>
                                </Stack>
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{ minWidth: 56, height: 28, fontSize: "0.72rem" }}
                                    onClick={() => onAdd(u)}
                                >
                                    Add
                                </Button>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Box>
        </Dialog>
    );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [assignedUsers, setAssignedUsers] = React.useState(MOCK_USERS);
    const [addModalOpen, setAddModalOpen] = React.useState(false);

    const handleAdd = (user: typeof AVAILABLE_USERS[0]) => {
        (async () => {
            try {
                // optimistic update
                setAssignedUsers((prev) => [...prev, { ...user, role: "Member" }]);
                const { status } = await addUserToInstance(projectId, user.id);
                if (status === 200) {
                    toast.success(`${user.name} added to project`);
                    return;
                }
                throw new Error('Add user failed');
            } catch (err) {
                console.error(err);
                // rollback
                setAssignedUsers((prev) => prev.filter((u) => u.id !== user.id));
                toast.error('Failed to add user to project');
            }
        })();
    };

    const handleRemove = (userId: string) => {
        (async () => {
            try {
                // optimistic remove
                const prevUsers = assignedUsers;
                setAssignedUsers((prev) => prev.filter((u) => u.id !== userId));
                const { status } = await removeUserFromInstance(projectId, userId);
                if (status === 200) {
                    toast.success('User removed from project');
                    return;
                }
                throw new Error('Remove failed');
            } catch (err) {
                console.error(err);
                // rollback by refetching or restoring prev state is not available here, show error
                toast.error('Failed to remove user from project');
            }
        })();
    };

    return (
        <Stack spacing={3}>
            {/* Add user modal */}
            <AddUserModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                assignedUsers={assignedUsers}
                onAdd={handleAdd}
            />

            {/* Header row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>
                    Project Users
                    <Chip label={assignedUsers.length} size="small" sx={{ ml: 1, fontWeight: 700, fontSize: "0.75rem" }} />
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<UserPlusIcon size={16} />}
                    onClick={() => setAddModalOpen(true)}
                >
                    Add User
                </Button>
            </Stack>

            {/* Assigned users list */}
            {assignedUsers.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No users assigned to this project.
                </Alert>
            ) : (
                <Stack spacing={1}>
                    {assignedUsers.map((u) => (
                        <Stack
                            key={u.id}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                px: 2, py: 1.5, borderRadius: 2,
                                border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                                background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 36, height: 36, fontSize: "0.8rem", bgcolor: avatarColor(u.id) }}>
                                    {getInitials(u.name)}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label={u.role} size="small" variant="outlined" sx={{ fontSize: "0.72rem", height: 22 }} />
                                <Tooltip title="Remove from project">
                                    <IconButton size="small" onClick={() => handleRemove(u.id)} sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}>
                                        <XIcon size={16} />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ project, projectId, onRename }: { project: typeof MOCK_PROJECT; projectId: string; onRename?: (newName: string) => Promise<void> | void }) {
    const router = useRouter();
    const [confirmed, setConfirmed] = React.useState(false);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [isDeleting, setIsDeleting] = React.useState(false);
    const handleDelete = async () => {
        if (!confirmed) { toast.error("Please confirm deletion first"); return; }
        setIsDeleting(true);
        try {
            const { status } = await deleteBrandInstance(projectId);
            if (status === 200) {
                toast.success("Project deleted");
                router.push('/dashboard/projects');
                return;
            }
            throw new Error('Delete failed');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete project');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Stack spacing={4}>
            {/* Rename */}
            <Box
                sx={{
                    p: 3, borderRadius: 2,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                    background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                }}
            >
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>General</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Update the display name of this project.</Typography>
                <RenameSection initialName={project.name} onRename={onRename} />
            </Box>

            {/* Danger Zone */}
            <Box
                sx={{
                    p: 3, borderRadius: 2,
                    border: "1px solid",
                    borderColor: "error.light",
                    background: isDark ? "rgba(239,68,68,0.04)" : "rgba(239,68,68,0.02)",
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <WarningIcon size={18} color="#ef4444" />
                    <Typography variant="subtitle1" fontWeight={700} color="error">Danger Zone</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Deleting a project will permanently remove all project files &amp; metadata, all vector embeddings, and user assignments (users won&apos;t be deleted).
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <input
                        type="checkbox"
                        id="delete-confirm"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#ef4444" }}
                    />
                    <label htmlFor="delete-confirm" style={{ fontSize: "0.85rem", cursor: "pointer", color: theme.palette.text.secondary }}>
                        I understand this will permanently delete the project and ALL its data
                    </label>
                </Stack>

                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={!confirmed || isDeleting}
                    startIcon={<TrashIcon size={16} />}
                    onClick={handleDelete}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Project'}
                </Button>
            </Box>
        </Stack>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectDetail({ projectId }: { projectId: string }) {
    const [tab, setTab] = React.useState(0);
    const project = MOCK_PROJECT; // swap with real fetch once API is ready
    const router = useRouter();

    const handleRename = async (newName: string) => {
        // call updateBrandInstance
        try {
            const { status } = await updateBrandInstance(projectId, { name: newName });
            if (status === 200) return;
            throw new Error('Failed to rename');
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return (
        <Stack spacing={4}>
            {/* Back button */}
            <Box>
                <Button
                    component={RouterLink}
                    href={paths.dashboard.projects}
                    startIcon={<ArrowLeftIcon size={16} />}
                    // size="medium"
                    // color="inherit"
                    sx={{ color: "text.secondary", mb: 2 }}
                >
                    Back to Projects
                </Button>

                {/* Page title */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="h4" fontWeight={700}>
                        {project.name}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                    ID: {project.id}
                </Typography>
            </Box>

            {/* Stats row */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <StatCard label="Total Users" value={MOCK_USERS.length} icon={<UsersIcon size={22} weight="duotone" />} />
                <StatCard label="Total Files" value={project.files} icon={<FolderOpenIcon size={22} weight="duotone" />} />
                <StatCard label="Created" value={project.createdAt} icon={<CalendarIcon size={22} weight="duotone" />} />
            </Stack>

            <Divider />

            {/* Tabs */}
            <Box>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
                >

                    <Tab
                        label="Settings"
                        icon={<PencilIcon size={16} />}
                        iconPosition="start"
                        sx={{ minHeight: 44, gap: 0.5 }}
                    />
                    <Tab
                        label="Users"
                        icon={<UsersIcon size={16} />}
                        iconPosition="start"
                        sx={{ minHeight: 44, gap: 0.5 }}
                    />
                </Tabs>

                {tab === 0 && <SettingsTab project={project} projectId={projectId} onRename={handleRename} />}
                {tab === 1 && <UsersTab />}
            </Box>
        </Stack>
    );
}
