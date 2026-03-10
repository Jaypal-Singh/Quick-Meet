import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/meetings', label: 'Meetings', icon: <VideocamIcon /> },
    { path: '/summaries', label: 'Summaries', icon: <AutoAwesomeIcon /> },
    { path: '/transcripts', label: 'Transcripts', icon: <ChatIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function SideBar() {
    return (
        <Box
            sx={{
                width: 260,
                minWidth: 260,
                flexShrink: 0,
                bgcolor: '#171C28',
                background: 'linear-gradient(180deg, #1C2230 0%, #131722 100%)',
                borderRight: '1px solid rgba(255, 255, 255, 0.03)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                p: 3,
                boxSizing: 'border-box',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
            }}
        >
            {/* User / Logo Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 5,
                    cursor: 'pointer',
                    '&:hover .logo-icon': {
                        transform: 'rotate(-10deg) scale(1.1)',
                    }
                }}
            >
                <Box
                    className="logo-icon"
                    sx={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2.5,
                        color: '#FFFFFF',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <VideocamIcon fontSize="small" />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                        MeetNext
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8B5CF6', letterSpacing: 1.5, fontSize: '0.65rem', fontWeight: 700 }}>
                        PRO SUITE
                    </Typography>
                </Box>
            </Box>

            {/* Navigation */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {NAV_ITEMS.map((item) => (
                    <Box
                        component={NavLink}
                        key={item.path}
                        to={item.path}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: '#94A3B8',
                            padding: '12px 18px',
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontWeight: 500,
                            position: 'relative',
                            overflow: 'hidden',
                            '&.active': {
                                color: '#FFFFFF',
                                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                fontWeight: 600,
                                '& .nav-icon': {
                                    color: '#8B5CF6',
                                    transform: 'scale(1.1)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '15%',
                                    height: '70%',
                                    width: '4px',
                                    backgroundColor: '#8B5CF6',
                                    borderRadius: '0 4px 4px 0',
                                }
                            },
                            '&:hover:not(.active)': {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                color: '#E2E8F0',
                                transform: 'translateX(6px)',
                                '& .nav-icon': {
                                    color: '#E2E8F0',
                                }
                            },
                        }}
                    >
                        <Box className="nav-icon" sx={{ mr: 2, display: 'flex', alignItems: 'center', transition: 'all 0.3s ease' }}>
                            {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.95rem', fontFamily: 'inherit' }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* New Meeting & Profile Section */}
            <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        color: '#FFFFFF',
                        borderRadius: '24px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        py: 1.5,
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    New Meeting
                </Button>

                <Box
                    sx={{
                        bgcolor: 'rgba(34, 43, 61, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: 'rgba(34, 43, 61, 0.9)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            '& .profile-icon': {
                                color: '#FFFFFF',
                                bgcolor: '#6366F1',
                            }
                        }
                    }}
                >
                    <Box
                        className="profile-icon"
                        sx={{
                            bgcolor: '#171C28',
                            borderRadius: '12px',
                            width: 38,
                            height: 38,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <PersonOutlineIcon sx={{ color: '#94A3B8', fontSize: 20, transition: 'color 0.3s ease' }} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
                            Alex Rivera
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 500 }}>
                            Pro Plan
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        sx={{
                            color: '#94A3B8',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                color: '#EF4444',
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
