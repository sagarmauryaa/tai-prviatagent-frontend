import React, { useContext } from 'react';
import { IconButton, Typography, useColorScheme, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeSwitch = () => {
    const theme = useTheme();
    const { mode, setMode } = useColorScheme();
    const switchText = mode === 'dark' ? 'Light Mode' : 'Dark Mode'; 
    return (
        <IconButton
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            color="inherit"
            className="switch-btn"
            sx={{width:'100%',justifyContent:'flex-start',alignItems:'center',gap:theme.spacing(2),padding:0}}
            size='small'
        >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
           <Typography>{switchText}</Typography> 
        </IconButton>
    )
}

export default ThemeSwitch