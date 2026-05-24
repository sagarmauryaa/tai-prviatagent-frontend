"use client";

import { Autocomplete, Chip, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getProjectsOptions } from "@/utils/backend-endpoints";

export interface ProjectOption {
    label: string;
    value: string;
}

interface SelectProjectFieldProps {
    value: string[];
    onChange: (projectIds: string[]) => void;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
}

const SelectProjectField = ({
    value,
    onChange,
    disabled = false,
    label = "Projects",
    placeholder = "Select projects…",
}: SelectProjectFieldProps) => {
    const [options, setOptions] = useState<ProjectOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, status } = await getProjectsOptions();
            if (status === 200) {
                const projects: Project[] = data?.data ?? [];
                setOptions(
                    projects.map((project) => ({
                        label: project.name,
                        value: project._id,
                    }))
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const selectedOptions = useMemo(
        () => options.filter((option) => value.includes(option.value)),
        [options, value]
    );

    return (
        <Autocomplete
            multiple
            options={options}
            value={selectedOptions}
            loading={isLoading}
            disabled={disabled}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, selected) => option.value === selected.value}
            onChange={(_, selected) => onChange(selected.map((option) => option.value))}
            renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                        <Chip
                            key={key}
                            label={option.label}
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
                    label={label}
                    size="small"
                    placeholder={selectedOptions.length === 0 ? placeholder : ""}
                />
            )}
        />
    );
};

export default SelectProjectField;
