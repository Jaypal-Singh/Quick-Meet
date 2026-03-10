import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Pagination() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4, pb: 4 }}>
            <IconButton size="small" sx={{ bgcolor: 'rgba(34, 43, 61, 0.6)', color: '#94A3B8', '&:hover': { bgcolor: 'rgba(34, 43, 61, 0.9)', color: '#E2E8F0' } }}>
                <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#6366F1',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem'
            }}>
                1
            </Box>

            <Typography sx={{
                width: 32,
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#94A3B8',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '50%',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#E2E8F0' }
            }}>
                2
            </Typography>

            <Typography sx={{
                width: 32,
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#94A3B8',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '50%',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#E2E8F0' }
            }}>
                3
            </Typography>

            <IconButton size="small" sx={{ bgcolor: 'rgba(34, 43, 61, 0.6)', color: '#94A3B8', '&:hover': { bgcolor: 'rgba(34, 43, 61, 0.9)', color: '#E2E8F0' } }}>
                <ChevronRightIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}
