import React from 'react';
import { Box, InputBase, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/Add';

export default function Header() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            {/* Search Bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(34, 43, 61, 0.4)',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    width: '400px',
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
                    placeholder="Search meetings, participants..."
                    sx={{ color: '#E2E8F0', width: '100%', fontSize: '0.95rem' }}
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

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    Schedule New Meeting
                </Button>
            </Box>
        </Box>
    );
}
