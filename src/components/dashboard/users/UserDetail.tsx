"use client";

import * as React from "react";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import RouterLink from "next/link";
import { paths } from "@/paths";

interface UserDetailProps {
    user: User | null;
}
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Question as QuestionIcon } from "@phosphor-icons/react/dist/ssr/Question";
import { FloppyDisk as SaveIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { ShieldCheck as ShieldIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { FolderOpen as FolderIcon } from "@phosphor-icons/react/dist/ssr/FolderOpen";
import { CalendarBlank as CalendarIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { Robot as RobotIcon } from "@phosphor-icons/react/dist/ssr/Robot";
import { Flag as FlagIcon } from "@phosphor-icons/react/dist/ssr/Flag";
import { Article as ArticleIcon } from "@phosphor-icons/react/dist/ssr/Article";
import { ChatCircle as ChatIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle";
import { toast } from "sonner";
import { updateUser } from "@/utils/backend-endpoints";

const MOCK_PROJECTS = [
    "Magento Data",
    "EE_ProductCatalog_PDFs",
    "EE_PDF_Catalog",
    "Support Knowledge Base",
    "Marketing Assets",
];

const AI_MODELS = [
    "gpt-5.2",
    "gpt-4o",
    "gpt-4-turbo",
    "claude-3-5-sonnet",
    "gemini-1.5-pro",
];

const FEATURE_FLAGS = [
    { key: "canSelectAIModel", label: "Can select AI model", tooltip: null },
    { key: "canEditPrivAgentMd", label: "Can edit PrivAgent.md", tooltip: null },
    {
        key: "canUploadEditDeleteFiles",
        label: "Can upload/edit/delete files",
        tooltip: "Grants permission to upload, edit, and delete files within assigned projects.",
    },
    {
        key: "canManageSQLDatabases",
        label: "Can manage SQL databases",
        tooltip: "Grants access to create, modify, and query SQL database connections.",
    },
    {
        key: "canViewFilesPage",
        label: "Can view Files page",
        tooltip: "Allows the user to view the Files section in their sidebar.",
    },
    {
        key: "canConfigureChatAgent",
        label: "Can configure Chat Agent",
        tooltip: "When disabled, the Chat Settings panel is hidden — the user chats with their saved defaults.",
    },
];

interface FeatureFlagState {
    canSelectAIModel: boolean;
    canEditPrivAgentMd: boolean;
    canUploadEditDeleteFiles: boolean;
    canManageSQLDatabases: boolean;
    canViewFilesPage: boolean;
    canConfigureChatAgent: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
                flex: 1,
                minWidth: 0,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider}`,
                background: isDark ? "rgba(255,255,255,0.02)" : theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.66rem", display: "block" }}
                >
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem", color: "text.secondary" }}>
                {title}
            </Typography>
        </Stack>
    );
}

function Card({ children, sx }: { children: React.ReactNode; sx?: object }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Box
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 2,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider}`,
                background: isDark ? theme.palette.background.paper : "#fff",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserDetail({ user }: UserDetailProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const userData = user ?? {
        _id: "",
        fullName: "",
        username: "",
        role: "USER",
        isAdmin: false,
        projects: [],
        canCrudFiles: false,
        hasPrivateDocAccess: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const [isAdmin, setIsAdmin] = React.useState(userData.isAdmin);
    const [assignedProjects, setAssignedProjects] = React.useState<string[]>(userData.projects);
    const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagState>({
        canSelectAIModel: false,
        canEditPrivAgentMd: false,
        canUploadEditDeleteFiles: false,
        canManageSQLDatabases: false,
        canViewFilesPage: false,
        canConfigureChatAgent: false,
    });
    const [aiModel, setAiModel] = React.useState("gpt-5.2");
    const [privAgentMd, setPrivAgentMd] = React.useState(
        `- Never show HubSpot refresh time for SERA questions\n\n\`\`\`sql\n-- Last refresh by system\nSELECT source_system, MAX(refresh_timestamp_uae) AS last_refresh\nFROM gold.pipeline_refresh_log\nGROUP BY source_system\nORDER BY last_refresh DESC\n\`\`\``
    );
    const [customFirstMessage, setCustomFirstMessage] = React.useState(
        `Hello Saurabh, Welcome. I am CLEO your data assistant for Exalto Emirates. I am still new and learning.\n\n🌐 What data is available\nThis assistant has access to Exalto data aggregated in Fabric from SERA ERP and HubSpot CRM.`
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const [isSaving, setIsSaving] = React.useState(false);
    const [formData, setFormData] = React.useState({
        fullName: userData.fullName || '',
        username: userData.username || '',
        role: (userData.role || (userData.isAdmin ? 'ADMIN' : 'USER')).toString().toUpperCase(),
    });

    const handleFlagChange = (key: keyof FeatureFlagState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeatureFlags((prev) => ({ ...prev, [key]: e.target.checked }));
    };

    const formattedDate = new Date(userData.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });

    const handleSave = async () => {
        if (!userData._id) return toast.error('Invalid user');
        if (!formData.username.trim()) return toast.error('Username is required');

        setIsSaving(true);
        try {
            const payload: any = {};
            if (formData.fullName && formData.fullName.trim()) payload.fullName = formData.fullName.trim();
            if (formData.username && formData.username.trim()) payload.username = formData.username.trim().toLowerCase();
            if (formData.role && formData.role.trim()) payload.role = formData.role.trim();

            await updateUser(userData._id, payload);
            toast.success('User updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Stack spacing={3}>

            {/* ── Back Button ── */}
            <Box>
                <Button
                    component={RouterLink}
                    href={paths.dashboard.users}
                    startIcon={<ArrowLeftIcon size={16} />}
                    sx={{ color: "text.secondary", pl: 0, mb: 1.5, "&:hover": { background: "transparent", color: "text.primary" } }}
                >
                    Back to Users
                </Button>

                {/* ── Profile Header Card ── */}
                <Card>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                    >
                        {/* Avatar + Name */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    fontSize: "1.2rem",
                                    fontWeight: 700,
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                }}
                            >
                                {userData.username.slice(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Stack spacing={1} sx={{ minWidth: 0 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TextField
                                            size="small"
                                            label="Full name"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                                            disabled={isSaving}
                                            sx={{ minWidth: 220 }}
                                        />
                                    </Stack>
                                    <TextField
                                        size="small"
                                        label="Username"
                                        value={formData.username}
                                        onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                                        disabled={isSaving}
                                        sx={{ maxWidth: 320 }}
                                    />
                                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: "block" }}>
                                        ID: {userData._id}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Delete Controls */}
                        <Box>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<TrashIcon size={15} />}
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                Delete User
                            </Button>
                        </Box>
                    </Stack>

                    {/* Stat Pills Row */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2.5 }}>
                        <StatPill icon={<FolderIcon size={16} weight="duotone" />} label="Projects" value={`${userData.projects.length} assigned`} />
                        <StatPill icon={<CalendarIcon size={16} weight="duotone" />} label="Created" value={formattedDate} />
                    </Stack>
                </Card>
            </Box>

            {/* ── Two-Column Body ── */}
            <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">

                {/* LEFT — Settings + Flags */}
                <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: "100%" }}>

                    {/* Change Settings */}
                    <Card>
                        <SectionTitle icon={<ShieldIcon size={15} />} title="Change Settings" />
                        <Stack spacing={2.5}>

                            {/* Admin row */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                                    background: isDark ? "rgba(255,255,255,0.02)" : theme.palette.background.default,
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>Administrator</Typography>
                                    <Typography variant="caption" color="text.secondary">Full access to all projects and settings</Typography>
                                </Box>
                                <Checkbox
                                    size="small"
                                    checked={formData.role === 'ADMIN'}
                                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.checked ? 'ADMIN' : 'USER' }))}
                                />
                            </Stack>

                            {/* Assigned Projects */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem", display: "block", mb: 1 }}
                                >
                                    Assigned Projects
                                </Typography>
                                <Autocomplete
                                    multiple
                                    options={MOCK_PROJECTS}
                                    value={assignedProjects}
                                    onChange={(_, value) => setAssignedProjects(value)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (
                                                <Chip
                                                    key={key}
                                                    label={option}
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
                                            placeholder={assignedProjects.length === 0 ? "Select projects…" : ""}
                                        />
                                    )}
                                />
                            </Box>
                        </Stack>
                    </Card>

                    {/* Feature Flags */}
                    <Card>
                        <SectionTitle icon={<FlagIcon size={15} />} title="Feature Flags" />
                        <Stack divider={<Divider />}>
                            {FEATURE_FLAGS.map((flag) => (
                                <Box key={flag.key}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{ py: 1.25 }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={0.75}>
                                            <Typography
                                                variant="body2"
                                                component="label"
                                                htmlFor={`flag-${flag.key}`}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                {flag.label}
                                            </Typography>
                                            {flag.tooltip && (
                                                <Tooltip title={flag.tooltip} placement="right" arrow>
                                                    <Box sx={{ display: "flex", color: "text.disabled", cursor: "help", "&:hover": { color: "text.secondary" } }}>
                                                        <QuestionIcon size={14} />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        </Stack>
                                        <Checkbox
                                            id={`flag-${flag.key}`}
                                            size="small"
                                            checked={featureFlags[flag.key as keyof FeatureFlagState]}
                                            onChange={handleFlagChange(flag.key as keyof FeatureFlagState)}
                                            sx={{ p: 0.5 }}
                                        />
                                    </Stack>

                                    {/* AI Model dropdown under first flag */}
                                    {flag.key === "canSelectAIModel" && (
                                        <Box sx={{ pb: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                                                AI Model for this user
                                            </Typography>
                                            <Select
                                                size="small"
                                                value={aiModel}
                                                onChange={(e) => setAiModel(e.target.value)}
                                                fullWidth
                                                disabled={!featureFlags.canSelectAIModel}
                                                startAdornment={
                                                    <Box sx={{ display: "flex", color: "text.disabled", mr: 1 }}>
                                                        <RobotIcon size={16} />
                                                    </Box>
                                                }
                                            >
                                                {AI_MODELS.map((m) => (
                                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Card>
                </Stack>

                {/* RIGHT — PrivAgent.md + Chat Message */}
                <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: "100%" }}>

                    {/* PrivAgent.md */}
                    <Card>
                        <SectionTitle icon={<ArticleIcon size={15} />} title="User's PrivAgent.md" />
                        <TextField
                            multiline
                            minRows={9}
                            maxRows={18}
                            fullWidth
                            value={privAgentMd}
                            onChange={(e) => setPrivAgentMd(e.target.value)}
                            placeholder="Enter markdown content for this user's PrivAgent…"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    fontFamily: "'Fira Code', 'JetBrains Mono', 'Roboto Mono', monospace",
                                    fontSize: "0.8rem",
                                    lineHeight: 1.75,
                                    background: isDark ? "rgba(0,0,0,0.15)" : "var(--mui-palette-neutral-50)",
                                    borderRadius: 1.5,
                                },
                            }}
                        />
                    </Card>

                    {/* Custom Chat Message */}
                    <Card>
                        <SectionTitle icon={<ChatIcon size={15} />} title="Custom first chat message" />
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                            Shown as the assistant&apos;s greeting when this user opens a new chat. Leave blank to use the default.
                        </Typography>
                        <TextField
                            multiline
                            minRows={5}
                            maxRows={12}
                            fullWidth
                            value={customFirstMessage}
                            onChange={(e) => setCustomFirstMessage(e.target.value)}
                            placeholder="Enter a custom greeting message…"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    fontSize: "0.875rem",
                                    lineHeight: 1.65,
                                    background: isDark ? "rgba(0,0,0,0.15)" : "var(--mui-palette-neutral-50)",
                                    borderRadius: 1.5,
                                },
                            }}
                        />
                    </Card>
                </Stack>
            </Stack>

            {/* ── Save Footer ── */}
            <Divider />
            <Divider />
            <Stack direction="row" justifyContent="flex-end" sx={{ pb: 2 }}>
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon size={17} />}
                    onClick={handleSave}
                    disabled={isSaving}
                    sx={{ borderRadius: 1.5, px: 3 }}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Stack>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                color: "error.main",
                                flexShrink: 0,
                            }}
                        >
                            <TrashIcon size={18} />
                        </Box>
                        <Typography variant="h6" fontWeight={700}>
                            Delete User
                        </Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ pt: "12px !important" }}>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to delete{" "}
                        <Typography component="span" variant="body2" fontWeight={700} color="text.primary">
                            {userData.username}
                        </Typography>
                        ? This action cannot be undone. The user will lose access to all assigned projects immediately.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        color="inherit"
                        size="small"
                        sx={{ borderRadius: 1.5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<TrashIcon size={15} />}
                        onClick={() => {
                            // TODO: wire to real delete API
                            toast.success(`User "${userData.username}" deleted`);
                            setDeleteDialogOpen(false);
                        }}
                        sx={{ borderRadius: 1.5 }}
                    >
                        Yes, Delete User
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
