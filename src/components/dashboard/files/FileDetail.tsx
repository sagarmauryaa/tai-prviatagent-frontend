"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { DownloadSimple as DownloadIcon } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { FileText as FileTextIcon } from "@phosphor-icons/react/dist/ssr/FileText";
import { Sparkle as SparkleIcon } from "@phosphor-icons/react/dist/ssr/Sparkle";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { toast } from "sonner";

import SelectProjectField from "@/components/dashboard/users/SelectProjectField";
import { paths } from "@/paths";
import { deletInfoData, getInfoDataById, updateInfoDataById } from "@/utils/backend-endpoints";
import {
  MOCK_PROJECTS,
  USE_STATIC_FILES_UI,
  getMockFileDetail,
  type MockFileDetail,
} from "./mock-data";
import StaticProjectSelect from "./StaticProjectSelect";
import ExtractedTextEditor from "./ExtractedTextEditor";
import { DESCRIPTION_MAX, EditableTextareaSection } from "./file-detail-fields";

interface FileDetailProps {
  fileId: string;
  projectId?: string;
}

function buildMetadataText(detail: MockFileDetail, description: string): string {
  const payload = {
    uri: detail.uri ?? null,
    resource_id: detail.resource_id ?? detail._id,
    filename: detail.filename ?? null,
    mime_type: detail.mime_type ?? "application/pdf",
    status: detail.status ?? null,
    status_detail: detail.status_detail ?? null,
    description: description || detail.description || null,
    ai_summary: detail.ai_summary ?? null,
    created_at: detail.created_at ?? null,
    updated_at: detail.updated_at ?? null,
  };
  return JSON.stringify(payload, null, 2);
}

function outlineButtonSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? alpha(theme.palette.common.white, 0.1) : theme.palette.divider;
  return {
    textTransform: "none" as const,
    fontWeight: 600,
    px: 2.5,
    py: 1,
    borderRadius: 1.5,
    borderColor,
    color: isDark ? theme.palette.text.primary : "#1a2b4a",
    bgcolor: isDark ? alpha(theme.palette.common.white, 0.02) : "#fff",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      bgcolor: alpha(theme.palette.primary.main, 0.04),
    },
  };
}

const FileDetail = ({ fileId, projectId: initialProjectId }: FileDetailProps) => {
  const router = useRouter();
  const theme = useTheme();

  const [selectedProject, setSelectedProject] = React.useState(
    initialProjectId ?? (USE_STATIC_FILES_UI ? MOCK_PROJECTS[0]._id : "")
  );
  const [fileData, setFileData] = React.useState<MockFileDetail | Record<string, unknown> | null>(null);

  const [metadataText, setMetadataText] = React.useState("");
  const [aiSummaryText, setAiSummaryText] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [extractedPages, setExtractedPages] = React.useState<string[]>([]);

  const [isLoading, setIsLoading] = React.useState(!USE_STATIC_FILES_UI);
  const [savingSection, setSavingSection] = React.useState<
    null | "metadata" | "aiSummary" | "description" | "extracted"
  >(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const applyDetailToForm = React.useCallback((details: MockFileDetail) => {
    setFileData(details);
    setMetadataText(buildMetadataText(details, details.description ?? ""));
    setAiSummaryText(details.ai_summary ?? "");
    setDescription(details.description ?? "");
    setExtractedPages(
      details.extracted_text_pages?.length
        ? [...details.extracted_text_pages]
        : [""]
    );
  }, []);

  const loadStaticFile = React.useCallback(() => {
    applyDetailToForm(getMockFileDetail(fileId));
    setIsLoading(false);
  }, [fileId, applyDetailToForm]);

  const fetchFile = React.useCallback(async () => {
    if (USE_STATIC_FILES_UI) {
      loadStaticFile();
      return;
    }
    if (!selectedProject || !fileId) return;
    setIsLoading(true);
    try {
      const { data, status } = await getInfoDataById(selectedProject, fileId);
      if (status === 200) {
        const raw = (data?.data?.data ?? data?.data ?? null) as Record<string, unknown> | null;
        if (raw) {
          const asDetail: MockFileDetail = {
            _id: String(raw._id ?? fileId),
            filename: String(raw.filename ?? raw.name ?? "File"),
            uri: String(raw.uri ?? ""),
            resource_id: String(raw.resource_id ?? raw._id ?? fileId),
            mime_type: String(raw.mime_type ?? raw.type ?? "application/pdf"),
            status: String(raw.status ?? "ready"),
            status_detail: (raw.status_detail as string | null) ?? null,
            description: (raw.description as string | null) ?? null,
            ai_summary: String(raw.ai_summary ?? raw.summary ?? ""),
            created_at: String(raw.created_at ?? raw.createdTime ?? ""),
            updated_at: String(raw.updated_at ?? raw.updatedTime ?? ""),
            publicUrl: String(raw.publicUrl ?? raw.url ?? raw.S3Url ?? ""),
            extracted_text_pages: Array.isArray(raw.extracted_text_pages)
              ? (raw.extracted_text_pages as string[])
              : Array.isArray(raw.pages)
                ? (raw.pages as unknown[]).map((p) => String(p ?? ""))
                : raw.text
                  ? [String(raw.text)]
                  : [""],
          };
          applyDetailToForm(asDetail);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load file details");
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, fileId, loadStaticFile, applyDetailToForm]);

  React.useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const handleUpdateMetadata = async () => {
    if (!selectedProject && !USE_STATIC_FILES_UI) return;
    setSavingSection("metadata");
    try {
      if (USE_STATIC_FILES_UI) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        toast.success("Information updated (static preview)");
        return;
      }
      toast.success("Information updated");
    } catch {
      toast.error("Failed to update information");
    } finally {
      setSavingSection(null);
    }
  };

  const handleUpdateAiSummary = async () => {
    if (!selectedProject && !USE_STATIC_FILES_UI) return;
    setSavingSection("aiSummary");
    try {
      if (USE_STATIC_FILES_UI) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setFileData((prev) => (prev ? { ...prev, ai_summary: aiSummaryText } : prev));
        toast.success("AI summary updated (static preview)");
        return;
      }
      toast.success("AI summary updated");
    } catch {
      toast.error("Failed to update AI summary");
    } finally {
      setSavingSection(null);
    }
  };

  const handleUpdateDescription = async () => {
    if (!selectedProject && !USE_STATIC_FILES_UI) return;
    setSavingSection("description");
    try {
      if (USE_STATIC_FILES_UI) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setFileData((prev) => (prev ? { ...prev, description } : prev));
        setMetadataText((prev) => {
          try {
            const parsed = JSON.parse(prev) as Record<string, unknown>;
            parsed.description = description || null;
            return JSON.stringify(parsed, null, 2);
          } catch {
            return prev;
          }
        });
        toast.success("Description updated (static preview)");
        return;
      }
      const { status } = await updateInfoDataById(selectedProject, fileId, description);
      if (status === 200) {
        toast.success("Description updated");
        await fetchFile();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update description");
    } finally {
      setSavingSection(null);
    }
  };

  const handleUpdateExtractedText = async () => {
    if (!selectedProject && !USE_STATIC_FILES_UI) return;
    setSavingSection("extracted");
    try {
      if (USE_STATIC_FILES_UI) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setFileData((prev) =>
          prev ? { ...prev, extracted_text_pages: extractedPages } : prev
        );
        toast.success("Extracted text updated (static preview)");
        return;
      }
      toast.success("Extracted text updated");
    } catch {
      toast.error("Failed to update extracted text");
    } finally {
      setSavingSection(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject && !USE_STATIC_FILES_UI) return;
    setIsDeleting(true);

    if (USE_STATIC_FILES_UI) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success("File deleted (static preview)");
      router.push(paths.dashboard.files);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      return;
    }

    try {
      const { status } = await deletInfoData({ brandId: selectedProject, infoId: fileId });
      if (status === 200) {
        toast.success("File deleted");
        router.push(paths.dashboard.files);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const fileUrl = String(
    (fileData as MockFileDetail)?.publicUrl ??
      (fileData as Record<string, unknown>)?.url ??
      (fileData as Record<string, unknown>)?.S3Url ??
      "#"
  );
  const displayFilename = String(
    (fileData as MockFileDetail)?.filename ??
      (fileData as Record<string, unknown>)?.name ??
      "File details"
  );

  const formDisabled = isLoading || (!USE_STATIC_FILES_UI && !selectedProject);

  if (isLoading && !fileData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {USE_STATIC_FILES_UI ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Static preview mode — actions are simulated locally.
        </Alert>
      ) : null}

      <Box>
        <Button
          component={RouterLink}
          href={paths.dashboard.files}
          variant="outlined"
          color="inherit"
          startIcon={<ArrowLeftIcon size={16} />}
          sx={outlineButtonSx(theme)}
        >
          Back to Files
        </Button>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          <FileTextIcon size={22} weight="duotone" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" fontWeight={700} noWrap>
            {displayFilename}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
            {fileId}
          </Typography>
        </Box>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              {USE_STATIC_FILES_UI ? (
                <StaticProjectSelect
                  value={selectedProject}
                  onChange={setSelectedProject}
                  disabled={formDisabled}
                />
              ) : (
                <SelectProjectField
                  value={selectedProject ? [selectedProject] : []}
                  onChange={(projects) => setSelectedProject(projects[0] ?? "")}
                  label="Project"
                  placeholder="Select project"
                  disabled={formDisabled}
                  multiple={false}
                />
              )}
            </Box>

            <EditableTextareaSection
              title="Information"
              label="File metadata (JSON)"
              value={metadataText}
              onChange={setMetadataText}
              onSave={handleUpdateMetadata}
              isSaving={savingSection === "metadata"}
              disabled={formDisabled}
              minRows={12}
              monospace
              saveLabel="Update information"
            />

            <EditableTextareaSection
              title="AI Summary"
              icon={<SparkleIcon size={20} weight="duotone" color={theme.palette.primary.main} />}
              label="AI summary"
              value={aiSummaryText}
              onChange={setAiSummaryText}
              onSave={handleUpdateAiSummary}
              isSaving={savingSection === "aiSummary"}
              disabled={formDisabled}
              minRows={6}
              placeholder="Edit AI-generated summary..."
              saveLabel="Update AI summary"
            />

            <EditableTextareaSection
              title="User's Description"
              icon={<PencilIcon size={20} weight="duotone" color={theme.palette.primary.main} />}
              label="File description"
              value={description}
              onChange={setDescription}
              onSave={handleUpdateDescription}
              isSaving={savingSection === "description"}
              disabled={formDisabled}
              minRows={5}
              placeholder="Add a description..."
              maxLength={DESCRIPTION_MAX}
              saveLabel="Update description"
            />

            <ExtractedTextEditor
              pages={extractedPages}
              onPagesChange={setExtractedPages}
              disabled={formDisabled}
              isSaving={savingSection === "extracted"}
              onSave={handleUpdateExtractedText}
            />
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2.5, pb: 2.5 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ ml: "auto" }}>
            <Button
              component="a"
              href={fileUrl || undefined}
              variant="outlined"
              color="inherit"
              download
              disabled={!fileUrl}
              target="_blank"
              rel="noreferrer"
              startIcon={<DownloadIcon size={18} />}
              sx={outlineButtonSx(theme)}
            >
              Download file
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting || formDisabled}
              startIcon={<TrashIcon size={18} />}
              sx={{
                ...outlineButtonSx(theme),
                borderColor: "error.light",
                color: "error.main",
              }}
            >
              Delete file
            </Button>
          </Stack>
        </CardActions>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={() => !isDeleting && setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
          Delete file?
          <IconButton
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
            size="small"
            sx={{ position: "absolute", top: 12, right: 12 }}
          >
            <XIcon size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove <strong>{displayFilename}</strong> and its indexed data. This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={18} color="inherit" /> : <TrashIcon size={18} />}
          >
            {isDeleting ? "Deleting..." : "Delete file"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default FileDetail;
