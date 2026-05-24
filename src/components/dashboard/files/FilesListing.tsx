"use client";

import * as React from "react";
import RouterLink from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { toast } from "sonner";

import SelectProjectField from "@/components/dashboard/users/SelectProjectField";
import PaginatedDataTable from "@/components/core/paginated-data-table";
import { FileDropzone } from "@/components/core/file-dropzone";
import { useAuth } from "@/components/auth/auth-context";
import { addInfoDataPDF, getInfoData } from "@/utils/backend-endpoints";
import { paths } from "@/paths";
import {
  MOCK_FILES_LIST,
  MOCK_PROJECTS,
  USE_STATIC_FILES_UI,
  type MockFileListItem,
} from "./mock-data";
import StaticProjectSelect from "./StaticProjectSelect";

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

const FilesListing = () => {
  const { selectedBrand, user } = useAuth();
  const [rows, setRows] = React.useState<MockFileListItem[]>(
    USE_STATIC_FILES_UI ? [...MOCK_FILES_LIST] : []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [totalRecords, setTotalRecords] = React.useState(
    USE_STATIC_FILES_UI ? MOCK_FILES_LIST.length : 0
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string>(
    USE_STATIC_FILES_UI ? MOCK_PROJECTS[0]._id : ""
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const apiProjectId = selectedProject || selectedBrand?._id || "";

  React.useEffect(() => {
    if (!USE_STATIC_FILES_UI && selectedBrand?._id) {
      setSelectedProject(selectedBrand._id);
    }
  }, [selectedBrand?._id]);

  const fetchFiles = React.useCallback(async () => {
    if (USE_STATIC_FILES_UI) return;
    if (!apiProjectId) return;
    setIsLoading(true);
    try {
      const { data, status } = await getInfoData(apiProjectId, page + 1, limit, search);
      if (status === 200) {
        const allRows = data?.data?.data ?? [];
        const pdfRows = allRows.filter(
          (item: MockFileListItem) => item.sourceType === "file" || item.fileMetaDataCount
        );
        setRows(pdfRows);
        setTotalRecords(data?.data?.pagination?.totalRecords ?? pdfRows.length);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  }, [apiProjectId, page, limit, search]);

  React.useEffect(() => {
    if (!USE_STATIC_FILES_UI) {
      fetchFiles();
    }
  }, [fetchFiles]);

  const filteredRows = React.useMemo(() => {
    if (!USE_STATIC_FILES_UI) return rows;
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row._id.toLowerCase().includes(query) ||
        row.filename.toLowerCase().includes(query)
    );
  }, [rows, search]);

  const paginatedRows = React.useMemo(() => {
    if (!USE_STATIC_FILES_UI) return filteredRows;
    const start = page * limit;
    return filteredRows.slice(start, start + limit);
  }, [filteredRows, page, limit]);

  React.useEffect(() => {
    if (USE_STATIC_FILES_UI) {
      setTotalRecords(filteredRows.length);
    }
  }, [filteredRows.length]);

  const displayRows = USE_STATIC_FILES_UI ? paginatedRows : rows;
  const displayLoading = USE_STATIC_FILES_UI ? false : isLoading;
  const linkProjectId = selectedProject || MOCK_PROJECTS[0]._id;

  const columns = [
    {
      name: "Filename",
      formatter: (row: MockFileListItem) => (
        <Button
          component={RouterLink}
          href={paths.dashboard.fileDetail(row._id, linkProjectId)}
          variant="text"
          sx={{ px: 0, textTransform: "none", fontWeight: 600 }}
        >
          {row.filename}
        </Button>
      ),
    },
    {
      name: "Type",
      formatter: () => (
        <Chip label="PDF" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: "0.72rem" }} />
      ),
    },
    {
      field: "fileMetaDataCount",
      name: "Pages indexed",
      formatter: (row: MockFileListItem) => row.fileMetaDataCount ?? 0,
    },
    {
      field: "createdTime",
      name: "Created",
      formatter: (row: MockFileListItem) =>
        row.createdTime ? new Date(row.createdTime).toLocaleString("en-US", dateTimeOptions) : "-",
    },
    {
      field: "updatedTime",
      name: "Updated",
      formatter: (row: MockFileListItem) =>
        row.updatedTime ? new Date(row.updatedTime).toLocaleString("en-US", dateTimeOptions) : "-",
    },
    {
      name: "Actions",
      formatter: (row: MockFileListItem) => (
        <Button
          component={RouterLink}
          href={paths.dashboard.fileDetail(row._id, linkProjectId)}
          size="small"
          variant="outlined"
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleUpload = async () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    if (USE_STATIC_FILES_UI) {
      setIsUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newId = `file-${Date.now()}`;
      const now = Date.now();
      setRows((prev) => [
        {
          _id: newId,
          filename: selectedFile.name,
          sourceType: "file",
          fileMetaDataCount: 0,
          createdTime: now,
          updatedTime: now,
        },
        ...prev,
      ]);
      toast.success("PDF uploaded (static preview)");
      setIsModalOpen(false);
      setSelectedFile(null);
      setIsUploading(false);
      return;
    }

    if (!user?.userId) {
      toast.error("Missing user information");
      return;
    }

    setIsUploading(true);
    try {
      const { status } = await addInfoDataPDF({
        userId: user.userId,
        brandId: selectedProject,
        pdf: selectedFile,
      });
      if (status === 200) {
        toast.success("PDF uploaded successfully");
        setIsModalOpen(false);
        setSelectedFile(null);
        await fetchFiles();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload PDF");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage PDF documents indexed per project.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon weight="bold" />} onClick={() => setIsModalOpen(true)}>
          Add File
        </Button>
      </Stack>

      {USE_STATIC_FILES_UI ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Static preview mode — data is mocked. Set <code>USE_STATIC_FILES_UI</code> to{" "}
          <code>false</code> in <code>mock-data.ts</code> to connect APIs.
        </Alert>
      ) : null}

      {USE_STATIC_FILES_UI ? (
        <StaticProjectSelect
          value={selectedProject}
          onChange={setSelectedProject}
          label="Filter by project"
        />
      ) : null}

      <Card className="data-table">
        <PaginatedDataTable
          isLoading={displayLoading}
          columns={columns}
          dataRow={displayRows}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalRecords={totalRecords}
          handleSearch={(event) => {
            setSearch(event.target.value);
            if (USE_STATIC_FILES_UI) setPage(0);
          }}
        />
      </Card>

      <Dialog open={isModalOpen} onClose={() => !isUploading && setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add PDF File</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Stack spacing={2.5}>
            {USE_STATIC_FILES_UI ? (
              <StaticProjectSelect
                value={selectedProject}
                onChange={setSelectedProject}
                disabled={isUploading}
              />
            ) : (
              <SelectProjectField
                value={selectedProject ? [selectedProject] : []}
                onChange={(projects) => setSelectedProject(projects[0] ?? "")}
                label="Project"
                placeholder="Select project"
                disabled={isUploading}
                multiple={false}
              />
            )}
            <FormControl error={!selectedFile} fullWidth>
              <FileDropzone
                acceptedFiles={{
                  "application/pdf": [".pdf"],
                }}
                maxSize={200 * 1024 * 1024}
                caption="PDF files only | Max 200MB"
                defaultFiles={selectedFile ? [selectedFile] : []}
                onDrop={(files) => setSelectedFile(files?.[0] ?? null)}
              />
              {!selectedFile ? <FormHelperText>Please select one PDF file.</FormHelperText> : null}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !selectedProject}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default FilesListing;
