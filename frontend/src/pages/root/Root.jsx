import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideBar from '../../components/sideBar/SideBar';

export default function Root() {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            height: '100vh', 
            bgcolor: '#0B0F19', 
            overflow: 'hidden' 
        }}>
            <SideBar />
            <Box component="main" sx={{ 
                flex: 1, 
                padding: { xs: '20px 16px', md: '28px 32px' }, 
                overflowY: 'auto',
                pb: { xs: '84px', md: '28px' } // Matches new bottom nav height + safe area, ensuring content isn't cut off
            }}>
                <Outlet />
            </Box>
        </Box>
    );
}
