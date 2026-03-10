import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/sideBar/SideBar';

export default function Root() {
    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#0B0F19', overflow: 'hidden' }}>
            <SideBar />
            <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
