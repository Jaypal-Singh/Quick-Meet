import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, Typography, LinearProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/meetings', label: 'Meetings', icon: <VideocamIcon /> },
    { path: '/summaries', label: 'Summaries', icon: <AutoAwesomeIcon /> },
    { path: '/reports', label: 'Reports', icon: <AssessmentIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function SideBar() {
    return (
        <Box
            sx={{
                width: 260,
                bgcolor: '#0B1B1B',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                p: 3,
                boxSizing: 'border-box',
            }}
        >
            {/* User / Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#2CD4CB',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: '#0B1B1B',
                        fontWeight: 'bold',
                    }}
                >
                    <VideocamIcon fontSize="small" />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2 }}>
                        MeetNext
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2CD4CB', letterSpacing: 1, fontSize: '0.65rem' }}>
                        PRO SUITE
                    </Typography>
                </Box>
            </Box>

            {/* Navigation */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: isActive ? '#2CD4CB' : '#A0B3B3',
                            backgroundColor: isActive ? '#0C2D2D' : 'transparent',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            fontWeight: isActive ? 600 : 400,
                        })}
                    >
                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                            {item.label}
                        </Typography>
                    </NavLink>
                ))}
            </Box>

            {/* Storage Widget */}
            <Box sx={{ mt: 'auto', p: 2, bgcolor: '#0C2D2D', borderRadius: '8px' }}>
                <Typography variant="caption" sx={{ color: '#A0B3B3', display: 'block', mb: 1 }}>
                    Storage Usage
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={60}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#1A3F3F',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#2CD4CB',
                        },
                        mb: 1
                    }}
                />
                <Typography variant="caption" sx={{ color: '#6A8080', fontSize: '0.7rem' }}>
                    12.4 GB of 20 GB used
                </Typography>
            </Box>
        </Box>
    );
}
