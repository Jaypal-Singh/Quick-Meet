import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideBar from '../../components/sideBar/SideBar';

export default function Root() {
    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#040F0F', overflow: 'hidden' }}>
            <SideBar />
            <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </Box>
    );
}
