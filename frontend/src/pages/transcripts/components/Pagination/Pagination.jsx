import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function Pagination() {
    const pages = [1, 2, 3];
    const activePage = 1;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
                size="small"
                sx={{
                    color: '#94A3B8',
                    bgcolor: 'rgba(34, 43, 61, 0.6)',
                    '&:hover': { bgcolor: 'rgba(34, 43, 61, 0.9)', color: 'white' }
                }}
            >
                <KeyboardArrowLeftIcon fontSize="small" />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 1 }}>
                {pages.map((page) => (
                    <Box
                        key={page}
                        sx={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            transition: 'all 0.2s',
                            bgcolor: activePage === page ? '#6366F1' : 'transparent',
                            color: activePage === page ? 'white' : '#94A3B8',
                            '&:hover': {
                                bgcolor: activePage === page ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                                color: activePage === page ? 'white' : '#E2E8F0',
                            }
                        }}
                    >
                        {page}
                    </Box>
                ))}
            </Box>

            <IconButton
                size="small"
                sx={{
                    color: '#94A3B8',
                    bgcolor: 'rgba(34, 43, 61, 0.6)',
                    '&:hover': { bgcolor: 'rgba(34, 43, 61, 0.9)', color: 'white' }
                }}
            >
                <KeyboardArrowRightIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}
