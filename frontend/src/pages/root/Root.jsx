import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/sideBar/SideBar';

export default function Root() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#040F0F' }}>
            <SideBar />
            <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
