import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    TextField,
    Stack,
    Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QRCode from "react-qr-code";

type ShareInstanceModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    link: string;
    title?: string;
    description?: string;
    image?: string;
};

const ShareInstanceModal: React.FC<ShareInstanceModalProps> = ({
    open,
    setOpen,
    link,
    title = "Tellofy AI",
    description = "Tellofy's AI Agent - Voice-powered AI assistant that reads the webpages, answers questions, and connects to your data in seconds.",
    image = ""
}) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const shareWithWebAPI = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text: description, url: link });
            } catch (error) {
                console.error("Share failed:", error);
            }
        } else {
            alert("Web Share API not supported on this device.");
        }
    };

    const shareVia = (platform: string) => {
        let shareUrl = "";

        switch (platform) {
            case "telegram":
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title + "\n" + description)}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + "\n" + description + "\n" + link)}`;
                break;
            case "reddit":
                shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(link)}&title=${encodeURIComponent(title)}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title + "\n" + description)}`;
                break;
            case "pinterest":
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(link)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`;
                break;
            default:
                break;
        }

        if (shareUrl) window.open(shareUrl, "_blank");
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" sx={{ zIndex: 9999 }}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Share with friends
                <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Share this link via
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" mb={2}>
                    {[
                        {
                            icon: <TelegramIcon sx={{ color: "#0088cc" }} />,
                            label: "Telegram",
                            onClick: () => shareVia("telegram")
                        },
                        {
                            icon: <WhatsAppIcon sx={{ color: "#25D366" }} />,
                            label: "WhatsApp",
                            onClick: () => shareVia("whatsapp")
                        },
                        {
                            icon: <RedditIcon sx={{ color: "#FF4500" }} />,
                            label: "Reddit",
                            onClick: () => shareVia("reddit")
                        },
                        {
                            icon: <FacebookIcon sx={{ color: "#1877F2" }} />,
                            label: "Facebook",
                            onClick: () => shareVia("facebook")
                        },
                        {
                            icon: <MoreHorizIcon />,
                            label: "Other",
                            onClick: () => shareWithWebAPI()
                        }
                    ].map(({ icon, label, onClick }) => (
                        <Box
                            key={label}
                            onClick={onClick}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 64,
                                cursor: 'pointer'
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 48,
                                    height: 48,
                                    mb: 0.5
                                }}
                            >
                                {icon}
                            </Box>
                            <Typography variant="caption">{label}</Typography>
                        </Box>
                    ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack gap={2} mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        Scan QR Code
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <QRCode value={link} size={250} />
                    </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                    Copy the Link
                </Typography>

                <Box display="flex" gap={1}>
                    <TextField value={link} fullWidth size="small" InputProps={{ readOnly: true }} variant="outlined" />
                    <IconButton onClick={handleCopy}>
                        <ContentCopyIcon />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ShareInstanceModal;
