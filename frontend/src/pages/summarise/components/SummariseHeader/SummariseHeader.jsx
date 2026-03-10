import React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function SummariseHeader() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            {/* Search Bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(34, 43, 61, 0.4)',
                    borderRadius: '12px',
                    px: 2,
                    py: 1.5,
                    width: '500px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:focus-within': {
                        bgcolor: 'rgba(34, 43, 61, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                    }
                }}
            >
                <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />
                <InputBase
                    placeholder="Search meetings, participants, or dates..."
                    sx={{ color: '#E2E8F0', width: '100%', fontSize: '0.9rem' }}
                />
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                    sx={{
                        bgcolor: 'rgba(34, 43, 61, 0.6)',
                        color: '#94A3B8',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                            bgcolor: 'rgba(34, 43, 61, 0.9)',
                            color: '#E2E8F0',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <NotificationsNoneIcon fontSize="small" />
                </IconButton>

                <IconButton
                    sx={{
                        bgcolor: 'rgba(34, 43, 61, 0.6)',
                        color: '#94A3B8',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                            bgcolor: 'rgba(34, 43, 61, 0.9)',
                            color: '#E2E8F0',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <HelpOutlineIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
