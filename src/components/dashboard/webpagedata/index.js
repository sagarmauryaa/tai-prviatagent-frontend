'use client'
import * as React from 'react';
import { Box, Button, Card, CardContent, Modal, Stack, Typography } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { format } from 'date-fns'; import RefreshIcon from '@mui/icons-material/Refresh';
import ContentEditable from 'react-contenteditable';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};
 
const WebPageData = ({
    value = '',
    link = '',

    createdAt = new Date(),
    updatedAt = new Date(),
}) => {
    const inputRef = React.useRef(null);
    const [inputValue, setInputValue] = React.useState(value);
    const [prevValue, setPrevValue] = React.useState(value);
    const [isEditing, setIsEditing] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleUpdate = React.useCallback(() => {
        if (inputValue !== prevValue) {
            setPrevValue(inputValue);
        }
        setIsEditing(false);
    }, [inputValue, prevValue]);

    const handleCancel = React.useCallback(() => {
        setInputValue(prevValue ?? '');
        setIsEditing(false);
    }, [prevValue]);

    const handleDelete = React.useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleEdit = () => {
        setIsEditing(true);

        setTimeout(() => {
            const target = inputRef.current;
            if (target instanceof HTMLDivElement) {
                target.focus();

                if (!target.textContent || target.textContent.trim() === "") {
                    target.innerHTML = "\u200B";
                }


                const selection = globalThis.getSelection();
                const range = document.createRange();

                if (selection && target.childNodes.length > 0) {
                    const textNode = target.childNodes[0];

                    const cursorPosition = Math.min(inputValue.length, textNode.textContent?.length || 0);

                    try {
                        range.setStart(textNode, cursorPosition);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch (error) {
                        console.error("Error setting cursor position:", error);
                    }
                }
            }
        }, 1);
    }; 

    const formatDate = (date) => {
        return format(new Date(date), 'dd-MM-yyyy HH:mm');
    };

    return (
        <React.Fragment>
            <Card sx={{ width: "100%", boxShadow: 2 }} >
                <CardContent className="infoAction">
                    <Stack direction="column" spacing={2} >
                        <ContentEditable
                            className='infoAction__input'
                            innerRef={inputRef}
                            html={inputValue}
                            tagName='div'
                            disabled={!isEditing}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Stack direction="row" spacing={3} sx={{ alignItems: "center", justifyContent: 'space-between' }}>
                            {isEditing && (
                                <Button variant="contained" onClick={handleUpdate}>
                                    Update
                                </Button>
                            )}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: "center", marginLeft: 'auto' }}>
                                <Stack direction="row" spacing={{ xs: 2, sm: 2 }} sx={{ alignItems: "center", marginLeft: 'auto' }}>
                                    <div className="infoAction_detail">
                                        <Typography variant="caption">Webpage URL:</Typography>
                                        <Typography><a href={link} rel='noreferrer' target='_blank'>Web Page Link</a></Typography>
                                    </div>
                                    {[
                                        { label: 'Added Time', value: formatDate(createdAt) },
                                        { label: 'Updated Time', value: formatDate(updatedAt) }
                                    ].map(({ label, value }) => (
                                        <div key={label} className="infoAction_detail">
                                            <Typography variant="caption">{label}:</Typography>
                                            <Typography>{value}</Typography>
                                        </div>
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={0} sx={{ alignItems: "center", marginLeft: 'auto' }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Delete Info
                                    </Button>
                                    {isEditing ? (

                                        <Button onClick={handleCancel}>
                                            <HighlightOffIcon />
                                        </Button>
                                    ) : (

                                            <Button
                                                onClick={handleEdit}
                                            >
                                                <ModeEditIcon />
                                            </Button>
                                    )}
                                    <Button 
                                    >
                                        <RefreshIcon />
                                    </Button>
                                    <Button 
                                    >
                                        <OpenInNewIcon />
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="delete-confirmation-modal"
            >
                <Box sx={MODAL_STYLE}>
                    <Card sx={{ width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                Are you sure?
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                Do you want to delete additional info?
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                <Button variant="text" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="contained"   onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </React.Fragment>
    );
};

export default WebPageData;