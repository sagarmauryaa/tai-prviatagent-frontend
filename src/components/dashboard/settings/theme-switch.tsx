"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Moon as MoonIcon } from "@phosphor-icons/react/dist/ssr/Moon";
import { Sun as SunIcon } from "@phosphor-icons/react/dist/ssr/Sun";
import { Button, CardActions } from "@mui/material"; 
import { updateDashboardSettings } from "@/utils/backend-endpoints";
import { useAuth } from "@/components/auth/auth-context";
import { toast } from "sonner"; 
export function ThemeSwitch() {
    const { selectedBrand, setSelectedBrand, currentSubscription } = useAuth();
 
    const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>('light'); // Initialize with mode or default to light
    const [message, setMessage] = React.useState<string>(''); // Initialize with mode or default to light
    const [isPending, setIsPending] = React.useState(false); 

    const handleSet = React.useCallback(async () => {
        if (!selectedBrand) {
            return;
        }
        try {
            setIsPending(true);
            const { welcomeMessage } = selectedBrand;

            const { data: response, status } = await updateDashboardSettings({ brandId: selectedBrand._id, theme, message: welcomeMessage });

            if (status === 200) {
                toast.success('Setting updated successfully');
                setIsPending(false); 
                setSelectedBrand({ ...selectedBrand, chatbotTheme: theme }); 
            } else {
                setIsPending(false);
                toast.error('Please try again later.');
                return;
            }
        } catch (error: any) {
            setIsPending(false);
        }
    }, [selectedBrand, setSelectedBrand, theme])

    
    const themeOptions = [
        { title: "Light mode", description: "Best for bright environments", value: 'light' as const, icon: SunIcon },
        { title: "Dark mode", description: "Recommended for dark rooms", value: 'dark' as const, icon: MoonIcon },
        { title: "System", description: "Adapts to your device's theme", value: 'system' as const, icon: SunIcon },
    ];


    React.useEffect(() => {
        if (selectedBrand) {
            const { welcomeMessage, chatbotTheme } = selectedBrand;
            setMessage(welcomeMessage);
            setTheme(chatbotTheme ?? 'light');
        }
    }, [selectedBrand]);

    if (!currentSubscription?.allowChatTheme) {
        return null;
    }

    return (
        <Card sx={{ width: "100%" }}>
            <CardHeader
                title="Theme options"
            />
            <CardContent>
                <Card variant="outlined">
                    <RadioGroup
                        value={theme}
                        sx={{
                            gap: 0,
                            "& .MuiFormControlLabel-root": {
                                justifyContent: "space-between",
                                p: "8px 12px",
                                "&:not(:last-of-type)": { borderBottom: "1px solid var(--mui-palette-divider)" },
                            },
                        }}
                    >
                        {themeOptions.map((option) => (
                            <FormControlLabel
                                control={<Radio />}
                                key={option.value}
                                onChange={() => setTheme(option.value)}
                                label={
                                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                                        <Avatar>
                                            <option.icon fontSize="var(--Icon-fontSize)" />
                                        </Avatar>
                                        <div>
                                            <Typography variant="inherit">{option.title}</Typography>
                                            <Typography color="text.secondary" variant="caption">
                                                {option.description}
                                            </Typography>
                                        </div>
                                    </Stack>
                                }
                                labelPlacement="start"
                                value={option.value}
                            />
                        ))}
                    </RadioGroup>
                </Card>
            </CardContent>
            <CardActions  >
                <Button
                    variant="contained"
                    onClick={handleSet}
                    disabled={isPending}
                    loading={isPending}
                >
                    {isPending ? 'Applying...' : 'Apply'}
                </Button>
            </CardActions>
        </Card>
    );
}