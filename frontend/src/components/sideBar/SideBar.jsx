import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
    { path: '/meetings', label: 'Meetings', icon: <VideocamIcon fontSize="small" /> },
    { path: '/summaries', label: 'Summaries', icon: <AutoAwesomeIcon fontSize="small" /> },
    { path: '/reports', label: 'Reports', icon: <AssessmentIcon fontSize="small" /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
];

export default function SideBar() {
    return (
        <aside
            style={{ width: '220px', minWidth: '220px' }}
            className="bg-[#0B1B1B] text-white flex flex-col h-screen sticky top-0"
        >
            {/* Inner padding container */}
            <div className="flex flex-col h-full p-6">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div
                        style={{ width: '36px', height: '36px' }}
                        className="bg-[#2CD4CB] rounded-lg flex items-center justify-center text-[#0B1B1B]"
                    >
                        <VideocamIcon fontSize="small" />
                    </div>
                    <div>
                        <p className="text-base font-bold" style={{ lineHeight: '1.2' }}>MeetNext</p>
                        <p className="text-[#2CD4CB] font-semibold" style={{ fontSize: '10px', letterSpacing: '2px' }}>PRO SUITE</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                fontSize: '14px',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                color: isActive ? '#2CD4CB' : '#A0B3B3',
                                backgroundColor: isActive ? '#0C2D2D' : 'transparent',
                                fontWeight: isActive ? 600 : 400,
                            })}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Storage Widget */}
                <div style={{ padding: '14px', backgroundColor: '#0C2D2D', borderRadius: '10px' }}>
                    <p style={{ color: '#A0B3B3', fontSize: '12px', marginBottom: '8px' }}>Storage Usage</p>
                    <div style={{ height: '6px', width: '100%', backgroundColor: '#1A3F3F', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ height: '100%', width: '62%', backgroundColor: '#2CD4CB', borderRadius: '999px' }}></div>
                    </div>
                    <p style={{ color: '#6A8080', fontSize: '11px' }}>12.4 GB of 20 GB used</p>
                </div>
            </div>
        </aside>
    );
}
