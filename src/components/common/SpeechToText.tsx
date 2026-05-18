import React, { useEffect, useRef, useState } from 'react';
import { Mic, Stop } from '@mui/icons-material';
import {
    Button, Stack, CircularProgress,
    Dialog, 
    DialogContent,
    Typography,
    DialogActions,
} from '@mui/material';

import { transcribeAudioToSpeech } from '@/utils/backend-endpoints';

const AUDIO_LIMIT = 180; // 3 minutes in seconds

interface SpeechToTextType {
    disabled?: boolean;
    onChange?: (text: string) => void;
    onModeChange?: (status: boolean) => void;
}

const SpeechToText: React.FC<SpeechToTextType> = ({
    disabled = false,
    onChange = () => { },
    onModeChange = () => { },
}) => {
    const [recording, setRecording] = useState(false);
    const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const recordTimerRef = useRef<NodeJS.Timeout | null>(null);


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recordedChunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunksRef.current.push(event.data);
        };

        setElapsedTime(0);
        recordTimerRef.current = setInterval(() => {
            setElapsedTime((prev) => { 
                if (prev + 1 >= AUDIO_LIMIT) {
                    stopRecording();
                    setAlert(true);
                }
                return prev + 1
            });

        }, 1000);

        recorder.onstop = () => {
            const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
            transcribeAudio(audioBlob);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setRecording(true);

    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
        if (recordTimerRef.current) {
            clearInterval(recordTimerRef.current);
            recordTimerRef.current = null;
        }
    };

    const transcribeAudio = async (blob: Blob) => {
        setLoading(true);
        try {
            const response = await transcribeAudioToSpeech(blob);
            if (response.status === 200 && response.data) {
                onChange(response.data);
            }
        } catch (error) {
            console.error('Transcription failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        onModeChange(recording);
    }, [recording]);
    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                {recording && (
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {new Date((AUDIO_LIMIT - elapsedTime) * 1000).toISOString().substr(14, 5)}
                    </span>
                )}
                <Button
                    variant="contained"
                    color={recording ? 'error' : 'primary'}
                    onClick={recording ? stopRecording : startRecording}
                    disabled={disabled || loading}
                    sx={{ height: 40, width: 60 }}
                    title={loading ? 'Analyzing Audio' : recording ? 'Stop Recording' : 'Start Recording'}
                >
                    {loading ? <CircularProgress size={12} /> : recording ? <Stop /> : <Mic />}
                </Button>

                <Dialog open={alert} onClose={() => setAlert(false)}>
                    <DialogContent>
                        <Typography>
                            You have reached maximum recording time. Click OK to continue.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setAlert(false)}
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </>
    );
};

export default SpeechToText;
