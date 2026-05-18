"use client";

import * as React from "react";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
    id: "usr-saurabh-001",
    username: "saurabh",
    password: "saurabh@123!",
    isAdmin: false,
    projects: ["EE_ProductCatalog_PDFs", "EE_PDF_Catalog"],
    createdAt: "2026-04-03T13:22:56.470670",
};

const MOCK_PROJECTS = [
    "Magento Data",
    "EE_ProductCatalog_PDFs",
    "EE_PDF_Catalog",
    "Support Knowledge Base",
    "Marketing Assets",
];

const AI_MODELS = ["gpt-5.2", "gpt-4o", "gpt-4-turbo", "claude-3-5-sonnet", "gemini-1.5-pro"];

const FEATURE_FLAGS = [
    { key: "canSelectAIModel", label: "Can select AI model", tooltip: null },
    { key: "canEditPrivAgentMd", label: "Can edit PrivAgent.md", tooltip: null },
    {
        key: "canUploadEditDeleteFiles",
        label: "Can upload/edit/delete files",
        tooltip: "Grants the user permission to upload, edit, and delete files within assigned projects.",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
    return name.slice(0, 2).toUpperCase();
}

function StatPill({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider}`,
                background: isDark ? "rgba(255,255,255,0.03)" : theme.palette.background.default,
                flex: 1,
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: alpha(theme.palette.primary.main, 0.12),
                    color: "primary.main",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.68rem" }}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    const theme = useTheme();
    return (
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2.5 }}>
            <Box
                sx={{
                    width: 30,
                    height: 30,
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
            <Typography variant="subtitle1" fontWeight={700}>
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
                borderRadius: 3,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : theme.palette.divider}`,
                background: isDark ? theme.palette.background.paper : "#fff",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function UserDetail({ userId }: { userId: string }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [isAdmin, setIsAdmin] = React.useState(MOCK_USER.isAdmin);
    const [assignedProjects, setAssignedProjects] = React.useState<string[]>(MOCK_USER.projects);
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
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const handleFlagChange = (key: keyof FeatureFlagState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeatureFlags((prev) => ({ ...prev, [key]: e.target.checked }));
    };

    const handleSave = () => {
        toast.success("User settings saved successfully");
    };

    const handleDelete = () => {
        if (!confirmDelete) { toast.error("Please confirm deletion first"); return; }
        toast.success("User deleted (stub)");
    };

    const formattedDate = new Date(MOCK_USER.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });

    return (
        <Stack spacing={3}>
            {/* ── Back ── */}
            <Box>
                <Button
                    component={RouterLink}
                    href={paths.dashboard.users}
                    startIcon={<ArrowLeftIcon size={16} />}
                    sx={{ color: "text.secondary", mb: 1.5, pl: 0, "&:hover": { background: "transparent", color: "text.primary" } }}
                >
                    Back to Users
                </Button>

                {/* ── Hero Header ── */}
                <Card sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                        <Stack direction="row" spacing={2.5} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    fontSize: "1.4rem",
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.6)})`,
                                    color: theme.palette.primary.contrastText,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                                }}
                            >
                                {getInitials(MOCK_USER.username)}
                            </Avatar>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h5" fontWeight={700}>
                                        {MOCK_USER.username}
                                    </Typography>
                                    {MOCK_USER.isAdmin && (
                                        <Chip label="Admin" size="small" color="primary" sx={{ fontWeight: 700, height: 22, fontSize: "0.7rem" }} />
                                    )}
                                    <Chip
                                        label="Active"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                            bgcolor: alpha(theme.palette.success.main, 0.12),
                                            color: "success.main",
                                        }}
                                    />
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                    ID: {MOCK_USER.id}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Delete action */}
                        <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={confirmDelete}
                                        onChange={(e) => setConfirmDelete(e.target.checked)}
                                        sx={{ color: "error.main", "&.Mui-checked": { color: "error.main" }, p: 0.5 }}
                                    />
                                }
                                label={<Typography variant="caption" color="text.secondary">Confirm deletion</Typography>}
                                sx={{ mx: 0 }}
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                disabled={!confirmDelete}
                                startIcon={<TrashIcon size={15} />}
                                onClick={handleDelete}
                                sx={{ borderRadius: 1.5, fontSize: "0.8rem" }}
                            >
                                Delete User
                            </Button>
                        </Stack>
                    </Stack>

                    {/* Stat pills */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                        <StatPill icon={<UserIcon size={18} weight="duotone" />} label="Username" value={MOCK_USER.username} />
                        <StatPill icon={<ShieldIcon size={18} weight="duotone" />} label="Role" value={MOCK_USER.isAdmin ? "Admin" : "Member"} />
                        <StatPill icon={<FolderIcon size={18} weight="duotone" />} label="Projects" value={`${MOCK_USER.projects.length} assigned`} />
                        <StatPill icon={<CalendarIcon size={18} weight="duotone" />} label="Created" value={formattedDate} />
                    </Stack>
                </Card>
            </Box>

            {/* ── Two-col layout ── */}
            <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
                {/* LEFT column */}
                <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: "100%" }}>

                    {/* Change Settings */}
                    <Card>
                        <SectionHeader icon={<ShieldIcon size={16} weight="duotone" />} title="Change Settings" />
                        <Stack spacing={2.5}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    borderRadius: 2,
                                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                                    background: isAdmin
                                        ? alpha(theme.palette.primary.main, 0.06)
                                        : isDark ? "rgba(255,255,255,0.02)" : theme.palette.background.default,
                                    transition: "all 0.2s",
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>Administrator</Typography>
                                    <Typography variant="caption" color="text.secondary">Full access to all settings and projects</Typography>
                                </Box>
                                <Checkbox
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    sx={{ color: "text.disabled" }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem", display: "block", mb: 1 }}>
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
                                        <TextField {...params} size="small" placeholder={assignedProjects.length === 0 ? "Select projects…" : ""} />
                                    )}
                                />
                            </Box>
                        </Stack>
                    </Card>

                    {/* Feature Flags */}
                    <Card>
                        <SectionHeader icon={<FlagIcon size={16} weight="duotone" />} title="Feature Flags" />
                        <Stack spacing={1}>
                            {FEATURE_FLAGS.map((flag, i) => (
                                <React.Fragment key={flag.key}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            border: `1px solid ${featureFlags[flag.key as keyof FeatureFlagState]
                                                ? alpha(theme.palette.primary.main, 0.25)
                                                : isDark ? "rgba(255,255,255,0.05)" : theme.palette.divider}`,
                                            background: featureFlags[flag.key as keyof FeatureFlagState]
                                                ? alpha(theme.palette.primary.main, 0.05)
                                                : "transparent",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="body2" component="label" htmlFor={`flag-${flag.key}`} sx={{ cursor: "pointer", fontWeight: 500 }}>
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

                                        {/* AI Model sub-control */}
                                        {flag.key === "canSelectAIModel" && (
                                            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}` }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                                                    AI Model for this user
                                                </Typography>
                                                <Select
                                                    size="small"
                                                    value={aiModel}
                                                    onChange={(e) => setAiModel(e.target.value)}
                                                    fullWidth
                                                    disabled={!featureFlags.canSelectAIModel}
                                                    startAdornment={<RobotIcon size={16} style={{ marginRight: 8, opacity: 0.6 }} />}
                                                >
                                                    {AI_MODELS.map((m) => (
                                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                                    ))}
                                                </Select>
                                            </Box>
                                        )}
                                    </Box>
                                    {i < FEATURE_FLAGS.length - 1 && <Box />}
                                </React.Fragment>
                            ))}
                        </Stack>
                    </Card>
                </Stack>

                {/* RIGHT column */}
                <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: "100%" }}>

                    {/* PrivAgent.md */}
                    <Card>
                        <SectionHeader icon={<ArticleIcon size={16} weight="duotone" />} title="User's PrivAgent.md" />
                        <TextField
                            multiline
                            minRows={8}
                            maxRows={18}
                            fullWidth
                            value={privAgentMd}
                            onChange={(e) => setPrivAgentMd(e.target.value)}
                            placeholder="Enter markdown content for this user's PrivAgent…"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
                                    fontSize: "0.8rem",
                                    lineHeight: 1.7,
                                    background: isDark ? "rgba(0,0,0,0.2)" : alpha(theme.palette.neutral?.[50] ?? "#f9f9f9", 1),
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Card>

                    {/* Custom first chat message */}
                    <Card>
                        <SectionHeader icon={<ChatIcon size={16} weight="duotone" />} title="Custom first chat message" />
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                            Shown as the assistant&apos;s greeting when this user opens a new chat. Leave blank to use the default.
                        </Typography>
                        <TextField
                            multiline
                            minRows={5}
                            maxRows={10}
                            fullWidth
                            value={customFirstMessage}
                            onChange={(e) => setCustomFirstMessage(e.target.value)}
                            placeholder="Enter a custom greeting message…"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    fontSize: "0.875rem",
                                    lineHeight: 1.65,
                                    background: isDark ? "rgba(0,0,0,0.2)" : alpha(theme.palette.neutral?.[50] ?? "#f9f9f9", 1),
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Card>
                </Stack>
            </Stack>

            {/* ── Footer Save ── */}
            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    zIndex: 10,
                    pt: 2,
                    pb: 3,
                    mt: 1,
                    background: isDark
                        ? `linear-gradient(to top, ${theme.palette.background.default} 70%, transparent)`
                        : `linear-gradient(to top, #fff 70%, transparent)`,
                }}
            >
                <Divider sx={{ mb: 2.5 }} />
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                    <Typography variant="caption" color="text.disabled">
                        Changes are saved immediately after clicking Save
                    </Typography>
                    <Button
                        variant="contained"
                        size="medium"
                        startIcon={<SaveIcon size={17} />}
                        onClick={handleSave}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                            "&:hover": {
                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                            },
                        }}
                    >
                        Save Changes
                    </Button>
                </Stack>
            </Box>
        </Stack>
    );
}
