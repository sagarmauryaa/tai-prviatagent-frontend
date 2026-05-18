import React from "react";
import { 
    Dialog, 
    DialogContent, 
    IconButton,
    Box, 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 
import QRCode from "react-qr-code";

type QRModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    link: string;
};

const QRModal: React.FC<QRModalProps> = ({ open, setOpen, link }) => {

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth className="qr-modal" sx={{ zIndex: '9999', width: 'auto', background: 'transparent !important' }}>
            <IconButton onClick={() => setOpen(false)} className="close-button">
                <CloseIcon />
            </IconButton>
            <DialogContent className="qr" sx={{ width: 'auto', background: 'transparent !important' }}   >
                <Box display="flex" justifyContent="center">
                    <QRCode value={link} size={280} />
                </Box>
            </DialogContent>

        </Dialog>
    );
};

export default QRModal;
