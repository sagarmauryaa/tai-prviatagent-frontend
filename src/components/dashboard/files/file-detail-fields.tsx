"use client";

import { Box, Button, CircularProgress, FormHelperText, Stack, TextField, Typography, alpha, useTheme } from "@mui/material";

export const DESCRIPTION_MAX = 4000;

export function useEditableFieldStyles() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const panelBg = isDark ? alpha(theme.palette.common.white, 0.04) : "#f4f6fa";

  return {
    theme,
    isDark,
    panelBg,
    textareaSx: {
      "& .MuiOutlinedInput-root": {
        bgcolor: panelBg,
        borderRadius: 2,
        alignItems: "flex-start",
      },
    },
    monospaceSx: {
      "& .MuiOutlinedInput-root": {
        bgcolor: panelBg,
        borderRadius: 2,
        alignItems: "flex-start",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "0.8rem",
      },
    },
  };
}

export function SectionHeading({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
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

interface EditableTextareaSectionProps {
  title: string;
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
  disabled?: boolean;
  minRows?: number;
  placeholder?: string;
  monospace?: boolean;
  maxLength?: number;
  saveLabel?: string;
}

export function EditableTextareaSection({
  title,
  icon,
  label,
  value,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  minRows = 5,
  placeholder,
  monospace = false,
  maxLength,
  saveLabel = "Update",
}: EditableTextareaSectionProps) {
  const { textareaSx, monospaceSx, isDark, theme } = useEditableFieldStyles();
  const length = value.length;

  return (
    <Box>
      <SectionHeading icon={icon}>{title}</SectionHeading>
      <Box sx={{ position: "relative" }}>
        <TextField
          fullWidth
          multiline
          minRows={minRows}
          label={label}
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            if (maxLength !== undefined && next.length > maxLength) return;
            onChange(next);
          }}
          placeholder={placeholder}
          disabled={disabled || isSaving}
          sx={{
            ...(monospace ? monospaceSx : textareaSx),
            ...(maxLength ? { "& .MuiOutlinedInput-root": { pb: 3 } } : {}),
          }}
        />
        {maxLength !== undefined ? (
          <FormHelperText
            sx={{
              position: "absolute",
              right: 14,
              bottom: 10,
              m: 0,
              fontSize: "0.75rem",
              color: length >= maxLength ? "error.main" : "text.disabled",
            }}
          >
            {length}/{maxLength}
          </FormHelperText>
        ) : null}
      </Box>
      <Box sx={{ mt: 2 }}>
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
          {isSaving ? "Updating..." : saveLabel}
        </Button>
      </Box>
    </Box>
  );
}
