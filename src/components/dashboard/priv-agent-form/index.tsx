'use client';

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useAuth } from "@/components/auth/auth-context";
import { getBrandPropmts, updateBrandPropmts } from "@/utils/backend-endpoints";
import { toast } from "sonner";

const PrivAgentForm = () => {
  const { selectedBrand } = useAuth();
  const [localText, setLocalText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalPrompts, setOriginalPrompts] = useState<any[]>([]);

  const getPrompts = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, status } = await getBrandPropmts(id);
      if (status === 200 && data.data) {
        setOriginalPrompts(data.data);
        const combined = data.data.map((item: any) => item.promptText).join('\n\n');
        setLocalText(combined);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBrand) {
      getPrompts(selectedBrand._id);
    }
  }, [selectedBrand]);

  const handleSave = async () => {
    try {
      setIsPending(true);
      const brandId = selectedBrand?._id ?? '';
      const payload: any[] = [{ promptText: localText, selected: true }];
      
      if (originalPrompts.length > 0) {
         payload[0] = { ...originalPrompts[0], promptText: localText, selected: true };
      }
      
      const { status } = await updateBrandPropmts(brandId, payload);
      if (status === 200) {
        toast.success('Prompts updated successfully');
      }
    } catch (error: any) {
      toast.error('Failed to update. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleReload = () => {
    if (selectedBrand) {
      getPrompts(selectedBrand._id);
    }
  };

  return (
    <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, width: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TextField
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          variant="outlined"
          multiline
          rows={16}
          // minRows={10}
          // maxRows={16}
          fullWidth
          sx={{
            backgroundColor: '#f3f4f6',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: '#e5e7eb',
              },
            }
          }}
        />
      )}

      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        <Button
          type="button" 
          variant="contained"
          onClick={handleSave}
          disabled={isPending || isLoading}
          startIcon={isPending && <CircularProgress size={20} color="inherit" />}
          sx={{ 
            width: '20%', 
            backgroundColor: '#093c71', 
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#072e57' } 
          }}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          onClick={handleReload}
          disabled={isLoading}
          sx={{ 
            flexGrow: 1, 
            borderColor: '#d1d5db', 
            color: '#4b5563',
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Reload
        </Button>
      </Stack>
    </Stack>
  );
};

export default PrivAgentForm;