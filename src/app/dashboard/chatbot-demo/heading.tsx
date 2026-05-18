"use client"
import { useAuth } from '@/components/auth/auth-context';
import { Button, Stack, Typography } from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useState } from 'react';
import { REACT_APP_BASE_URL } from '@/utils/config';
import { QrCode, Share } from '@mui/icons-material';
import ShareInstanceModal from '@/components/core/share-instance-modal';
import QRModal from '@/components/core/qr-modal';

const Heading = () => {
    const { selectedBrand } = useAuth();
    const [open, setOpen] = useState(false);
    const [openQr, setOpenQr] = useState(false);
    const openInNewTab = async (text: string) => {
        window.open(text, '_blank');
    };

    function encodeId(id: string): string {
        const base64 = Buffer.from(id.toString()).toString('base64');
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return (
        <Stack className='mbl-flex-wrap' direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "flex-start" }}> 
            <Typography variant="h4">Chatbot Demo</Typography>
            <Stack direction={"row"} gap={1}>
                <Button className={"btn-demo"} onClick={() => selectedBrand && openInNewTab(`${REACT_APP_BASE_URL}/try-it-now/${encodeId(selectedBrand?._id)}`)} type="button" variant="outlined" sx={{ width: "fit-content" }}>
                    <ArrowOutwardIcon fontSize="small" />
                </Button>
                {
                    selectedBrand &&
                    <>
                        <Button className={"btn-demo"} onClick={() => setOpen(true)} type="button" variant="outlined" sx={{ width: "fit-content" }}>
                            <Share fontSize="small" />
                        </Button>
                        <ShareInstanceModal open={open} setOpen={setOpen} link={`${REACT_APP_BASE_URL}/try-it-now/${encodeId(selectedBrand?._id)}`} />
                        <Button className={"btn-demo"} onClick={() => setOpenQr(true)} type="button" variant="outlined" sx={{ width: "fit-content" }}>
                            <QrCode fontSize="small" />
                        </Button>
                        <QRModal open={openQr} setOpen={setOpenQr} link={`${REACT_APP_BASE_URL}/try-it-now/${encodeId(selectedBrand?._id)}`} />
                    </>
                }
            </Stack>

        </Stack>
    )
}

export default Heading