"use client";

import { MenuItem, TextField } from "@mui/material";
import { MOCK_PROJECTS } from "./mock-data";

interface StaticProjectSelectProps {
  value: string;
  onChange: (projectId: string) => void;
  disabled?: boolean;
  label?: string;
}

const StaticProjectSelect = ({
  value,
  onChange,
  disabled = false,
  label = "Project",
}: StaticProjectSelectProps) => (
  <TextField
    select
    fullWidth
    size="small"
    label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    disabled={disabled}
  >
    {MOCK_PROJECTS.map((project) => (
      <MenuItem key={project._id} value={project._id}>
        {project.name}
      </MenuItem>
    ))}
  </TextField>
);

export default StaticProjectSelect;
