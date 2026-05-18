'use client' 
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material'; 

const UploadingProcessing = ({ loading, onCancel }: { loading: boolean, onCancel: () => void }) => {

    return loading ? (
        <Backdrop
            open={true}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6" mt={2}>
                    Uploading files...
                </Typography>
                <Typography variant="body2" mt={1}>
                    Please wait while we process your files.
                </Typography>
                <Box mt={2}>
                    <button
                        onClick={() => onCancel?.()}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </Box>
            </Box>
        </Backdrop>
    ) : null;
};

export default UploadingProcessing;
