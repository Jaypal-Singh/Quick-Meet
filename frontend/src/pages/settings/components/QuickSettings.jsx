import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

export default function QuickSettings() {
    const { fontSize, setFontSize, appearance, setAppearance } = useSettings();

    const fontSizeOptions = ['Small', 'Medium', 'Large'];
    const appearanceOptions = [
        { label: 'Light', value: 'Light', icon: <LightModeIcon sx={{ fontSize: '16px' }} /> },
        { label: 'Dark', value: 'Dark', icon: <DarkModeIcon sx={{ fontSize: '16px' }} /> },
        { label: 'System', value: 'System', icon: <SettingsBrightnessIcon sx={{ fontSize: '16px' }} /> }
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 800, color: 'white', mb: 4 }}>
                Quick Settings
            </Typography>

            <Stack spacing={3}>
                {/* Font Size Setting */}
                <Box sx={{
                    backgroundColor: '#1C2230',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap'
                }}>
                    <Box>
                        <Typography sx={{ fontSize: '16px', fontWeight: 800, color: 'white', mb: 0.5, textTransform: 'uppercase' }}>
                            Font Size
                        </Typography>
                        <Typography sx={{ color: '#9CA3AF', fontSize: '14px' }}>
                            Customise your font size as per readability
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                        p: 0.5, 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        {fontSizeOptions.map((size) => (
                            <Button
                                key={size}
                                onClick={() => setFontSize(size)}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    color: fontSize === size ? 'white' : '#6B7280',
                                    bgcolor: fontSize === size ? '#6366F1' : 'transparent',
                                    boxShadow: fontSize === size ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                    '&:hover': {
                                        bgcolor: fontSize === size ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                                        color: 'white'
                                    },
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {size}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Appearance Setting */}
                <Box sx={{
                    backgroundColor: '#1C2230',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap'
                }}>
                    <Box>
                        <Typography sx={{ fontSize: '16px', fontWeight: 800, color: 'white', mb: 0.5, textTransform: 'uppercase' }}>
                            Appearance
                        </Typography>
                        <Typography sx={{ color: '#9CA3AF', fontSize: '14px' }}>
                            Choose your theme to look the best for your eyes
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                        p: 0.5, 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        {appearanceOptions.map((opt) => (
                            <Button
                                key={opt.value}
                                onClick={() => setAppearance(opt.value)}
                                startIcon={opt.icon}
                                sx={{
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    color: appearance === opt.value ? 'white' : '#6B7280',
                                    bgcolor: appearance === opt.value ? '#6366F1' : 'transparent',
                                    boxShadow: appearance === opt.value ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                    '&:hover': {
                                        bgcolor: appearance === opt.value ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                                        color: 'white'
                                    },
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    gap: 1
                                }}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}
