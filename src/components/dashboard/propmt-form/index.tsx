'use client';

import { useCallback, useEffect, useState } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Stack, TextField } from "@mui/material";
import { useAuth } from "@/components/auth/auth-context";
import { getBrandPropmts, updateBrandPropmts } from "@/utils/backend-endpoints";
import { toast } from "sonner";

interface RadioInputProps {
  value: string;
  handleChange: () => void;
  checked: boolean;
  onValueChange: (value: string) => void;
  disabled: boolean;
}

const RadioInput = ({ value, handleChange, checked, onValueChange, disabled }: RadioInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  const updateText = useCallback(() => {
    if (inputValue !== prevValue) {
      onValueChange(inputValue);
      setPrevValue(inputValue);
    }
    setIsEditing(false);
  }, [inputValue, prevValue, onValueChange]);

  const cancelEdit = useCallback(() => {
    setInputValue(prevValue);
    setIsEditing(false);
  }, [prevValue]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {isEditing ? (
        <>
          <TextField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            variant="outlined"
            size="small"
            className="prompt_input"
          />
          <Button variant="contained" color="primary" onClick={updateText}>
            Update
          </Button>
          <Button onClick={cancelEdit}>
            <HighlightOffIcon />
          </Button>
        </>
      ) : (
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={handleChange} disabled={disabled} />}
          label={prevValue}
        />
      )}
      {!isEditing && (
        <Button onClick={() => setIsEditing(true)}>
          <ModeEditIcon />
        </Button>
      )}
    </Stack>
  );
};

const checked_limit = 5;
const PromptForm = () => {
  const { selectedBrand, setLoading } = useAuth()
  const [inputValues, setInputValues] = useState<BrandPrompt[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkedCount = inputValues.filter((item) => item.selected).length;
  const isLimitReached = checkedCount >= checked_limit;

  const handleValueChange = (index: number, newText: string) => {
    setInputValues((prev) => {
      if (prev[index].promptText === newText) return prev; // Avoid unnecessary updates
      const updatedValues = [...prev];
      updatedValues[index] = { ...updatedValues[index], promptText: newText };
      handleSubmitWithValues(updatedValues);
      return updatedValues;
    });
  };

  const handleCheckboxChange = (index: number) => {
    setInputValues((prev) => {
      const updatedValues = [...prev];

      if (isLimitReached && !updatedValues[index].selected) {
        return prev;
      }

      updatedValues[index] = {
        ...updatedValues[index],
        selected: !updatedValues[index].selected,
      };
      handleSubmitWithValues(updatedValues);

      return updatedValues;
    });
  };

  // const handleSubmit = useCallback(async () => {
  //   try {
  //     setIsPending(true);
  //     const brandId = selectedBrand?._id ?? '';
  //     const { status } = await updateBrandPropmts(brandId, inputValues);
  //     if (status == 200) {
  //       setIsPending(false);
  //       toast.success('Prompts updated successfully');
  //     }
  //   } catch (error: any) {
  //     setIsPending(false);
  //     toast.error('Failed to update.Please try again.');
  //   }
  // }, [selectedBrand, inputValues]);

  const handleSubmitWithValues = async (newValues: BrandPrompt[]) => {
    try {
      setIsPending(true);
      const brandId = selectedBrand?._id ?? '';
      const { status } = await updateBrandPropmts(brandId, newValues);
      if (status == 200) {
        toast.success('Prompts updated successfully');
      }
    } catch (error: any) {
      toast.error('Failed to update. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const getPrompts = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, status } = await getBrandPropmts(id);
      if (status == 200) {
        setInputValues(data.data);
      }
    } catch (error: any) {

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedBrand) {
      getPrompts(selectedBrand._id)
    }
  }, [selectedBrand])

  return (
    <Stack direction={'column'} spacing={3} sx={{ alignItems: "flex-start", width: '100%' }}>
      {
        isLoading ?
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, width: "100%" }}>
            <CircularProgress />
          </Box>
          : <div className="prompt_list">
            {inputValues.length > 0 &&
              inputValues.map((item, index) => (
                <RadioInput
                  key={index}
                  value={item.promptText}
                  handleChange={() => handleCheckboxChange(index)}
                  checked={item.selected}
                  disabled={isLimitReached && !item.selected}
                  onValueChange={(newValue: string) => handleValueChange(index, newValue)}
                />
              ))}
          </div>
      }

      {/* <Button
        type="button"
        onClick={handleSubmit || isLoading}
        variant="contained"
        disabled={isPending}
        startIcon={isPending && <CircularProgress size={20} color="inherit" />}
      >
        {isPending ? 'Updating...' : 'Update'}
      </Button> */}
    </Stack>
  )
}

export default PromptForm;