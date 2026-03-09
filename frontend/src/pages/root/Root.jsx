import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideBar from '../../components/sideBar/SideBar';

export default function Root() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#040F0F' }}>
            <SideBar />
            <Box sx={{ flexGrow: 1, p: 4, ml: 0, overflowY: 'auto' }}>
                <Outlet />
            </Box>
        </Box>
    );
}
