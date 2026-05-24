"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TablePagination,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Article as ArticleIcon } from "@phosphor-icons/react/dist/ssr/Article";

interface ExtractedTextEditorProps {
  pages: string[];
  onPagesChange: (pages: string[]) => void;
  disabled?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
}

function SectionHeading({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
      {icon}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: theme.palette.mode === "dark" ? theme.palette.primary.light : "#1a2b4a",
          letterSpacing: "-0.02em",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

const ExtractedTextEditor = ({
  pages,
  onPagesChange,
  disabled = false,
  isSaving = false,
  onSave,
}: ExtractedTextEditorProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const panelBg = isDark ? alpha(theme.palette.common.white, 0.04) : "#f4f6fa";

  const [pageIndex, setPageIndex] = React.useState(0);

  const safePages = pages.length > 0 ? pages : [""];
  const totalPages = safePages.length;
  const clampedIndex = Math.min(pageIndex, totalPages - 1);

  React.useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [pageIndex, totalPages]);

  const currentText = safePages[clampedIndex] ?? "";

  const handleTextChange = (value: string) => {
    const next = [...safePages];
    next[clampedIndex] = value;
    onPagesChange(next);
  };

  const textareaSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: panelBg,
      borderRadius: 2,
      alignItems: "flex-start",
      fontFamily: "inherit",
    },
  };

  return (
    <Box>
      <SectionHeading icon={<ArticleIcon size={20} weight="duotone" color={theme.palette.primary.main} />}>
        Extracted Text
      </SectionHeading>

      <Stack spacing={1.5}>
        <TextField
          fullWidth
          multiline
          minRows={10}
          label="Page content"
          value={currentText}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder="Edit extracted text for this page..."
          disabled={disabled || isSaving}
          sx={textareaSx}
        />

        <TablePagination
          component="div"
          count={totalPages}
          page={clampedIndex}
          onPageChange={(_, newPage) => setPageIndex(newPage)}
          rowsPerPage={1}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => `Page ${clampedIndex + 1} of ${totalPages}`}
          labelRowsPerPage=""
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            px: 0,
            ".MuiTablePagination-toolbar": { pl: 0, pr: 0 },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-select": { display: "none" },
            ".MuiTablePagination-input": { display: "none" },
          }}
        />

        {onSave ? (
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onSave}
              disabled={disabled || isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                color: isDark ? theme.palette.text.primary : "#1a2b4a",
              }}
            >
              {isSaving ? "Updating..." : "Update extracted text"}
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ExtractedTextEditor;
