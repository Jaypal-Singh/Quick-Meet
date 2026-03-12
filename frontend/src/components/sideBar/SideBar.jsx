import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/meetings', label: 'Meetings', icon: <VideocamIcon /> },
    { path: '/summaries', label: 'Summaries', icon: <AutoAwesomeIcon /> },
    { path: '/friends', label: 'Friends', icon: <PeopleIcon /> },
    { path: '/transcripts', label: 'Transcripts', icon: <ChatIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function SideBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const username = localStorage.getItem('username') || 'User';

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInstantMeeting = () => {
        handleClose();
        navigate(`/${Math.random().toString(36).substring(2, 9)}`);
    };

    const handleScheduleMeeting = () => {
        handleClose();
        navigate('/meetings', { state: { openSchedule: true } });
    };

    return (
        <Box
            sx={{
                width: { xs: '100%', md: 260 },
                minWidth: { md: 260 },
                height: { xs: 'auto', md: '100vh' },
                position: { xs: 'fixed', md: 'relative' },
                bottom: { xs: 0, md: 'auto' },
                left: { xs: 0, md: 'auto' },
                right: { xs: 0, md: 'auto' }, // Anchor right edge
                margin: 0,                    // Explicitly remove any margins
                zIndex: 1200,                 // Behind modals (1300) to allow blur
                flexShrink: 0,
                bgcolor: { xs: '#10131B', md: 'transparent' }, // Solid dark color for mobile
                background: {
                    xs: '#10131B', // Solid opaque color
                    md: 'linear-gradient(180deg, #1C2230 0%, #131722 100%)'
                },
                borderRight: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.03)' },
                borderTop: { xs: '1px solid rgba(255, 255, 255, 0.06)', md: 'none' },
                color: 'white',
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                justifyContent: { xs: 'space-between', md: 'flex-start' },
                alignItems: { xs: 'center', md: 'stretch' },
                p: { xs: 0, md: 3 },
                pb: { xs: 0, md: '24px' }, // Hard reset padding bottom to 0 to prevent env() from bubbling up height gaps
                boxSizing: 'border-box',
            }}
        >
            {/* User / Logo Section - Desktop Only */}
            {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, cursor: 'pointer', '&:hover .logo-icon': { transform: 'rotate(-10deg) scale(1.1)' } }}>
                    <Box className="logo-icon" sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2.5, color: '#FFFFFF', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <VideocamIcon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px' }}>MeetNext</Typography>
                        <Typography variant="caption" sx={{ color: '#8B5CF6', letterSpacing: 1.5, fontSize: '0.65rem', fontWeight: 700 }}>PRO SUITE</Typography>
                    </Box>
                </Box>
            )}

            {/* Navigation */}
            <Box sx={{
                flexGrow: { xs: 1, md: 1 },
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                gap: { xs: 0, md: 1 },
                justifyContent: { xs: 'space-between', md: 'flex-start' },
                width: '100%',
                px: { xs: 1.5, md: 0 } // Add padding to inner container so items aren't touching screen edges
            }}>
                {NAV_ITEMS.map((item) => {
                    // Hide Settings on mobile as per user request
                    if (isMobile && item.label === 'Settings') return null;

                    return (
                        <Box
                            component={NavLink}
                            key={item.path}
                            to={item.path}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                textDecoration: 'none',
                                color: '#94A3B8',
                                padding: { xs: '12px 0px 10px', md: '12px 18px' }, // Tweaked padding for exact look
                                borderRadius: { xs: '0px', md: '12px' }, // Square on mobile, rounded on md
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontWeight: 500,
                                position: 'relative',
                                overflow: 'visible', // Changed from hidden so the top bar shows fully on mobile edge
                                flex: { xs: 1, md: 'none' }, // Even distribution on mobile
                                '&.active': {
                                    color: '#FFFFFF',
                                    backgroundColor: { xs: 'transparent', md: 'rgba(99, 102, 241, 0.15)' },
                                    fontWeight: 600,
                                    '& .nav-icon': {
                                        color: { xs: '#8B5CF6', md: '#8B5CF6' },
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: { xs: '50%', md: 0 },
                                        top: { xs: '-1px', md: '15%' }, // Start from exact top edge
                                        transform: { xs: 'translateX(-50%)', md: 'none' },
                                        height: { xs: '3px', md: '70%' },
                                        width: { xs: '32px', md: '4px' },
                                        backgroundColor: '#8B5CF6',
                                        borderRadius: { xs: '0 0 4px 4px', md: '0 4px 4px 0' },
                                        display: 'block'
                                    }
                                },
                                '&:hover:not(.active)': {
                                    backgroundColor: { xs: 'transparent', md: 'rgba(255, 255, 255, 0.04)' },
                                    color: '#E2E8F0',
                                    transform: { xs: 'none', md: 'translateX(6px)' },
                                    '& .nav-icon': {
                                        color: '#E2E8F0',
                                    }
                                },
                            }}
                        >
                            <Box className="nav-icon" sx={{ mr: { xs: 0, md: 2 }, mb: { xs: 0.8, md: 0 }, display: 'flex', alignItems: 'center', transition: 'all 0.3s ease', '& > svg': { fontSize: { xs: '1.4rem', md: '1.5rem' } } }}>
                                {item.icon}
                            </Box>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', md: '0.95rem' }, fontFamily: 'inherit', letterSpacing: { xs: '-0.2px', md: '0px' }, mt: 0.5 }}>
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}

                {/* Profile Item - Mobile Only */}
                {isMobile && (
                    <Box
                        component={NavLink}
                        to="/settings"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: '#94A3B8',
                            padding: '12px 0px 10px', // Matches 12px padding of the rest
                            borderRadius: '0px',
                            flex: 1,
                            cursor: 'pointer',
                            position: 'relative',
                            '&.active': {
                                color: '#FFFFFF',
                                fontWeight: 600,
                                '& .profile-avatar': {
                                    borderColor: '#8B5CF6',
                                    color: '#FFFFFF'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: '50%',
                                    top: '-1px', // Exactly touching top border
                                    transform: 'translateX(-50%)',
                                    height: '3px',
                                    width: '32px',
                                    backgroundColor: '#8B5CF6',
                                    borderRadius: '0 0 4px 4px',
                                }
                            }
                        }}
                    >
                        <Box className="profile-avatar" sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.2)',
                            bgcolor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 0.8,
                            color: '#E2E8F0',
                            transition: 'all 0.3s ease'
                        }}>
                            <Typography sx={{ fontSize: '9px', fontWeight: 'bold' }}>{username.split(' ').map(n => n[0]).join('').toUpperCase()}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.65rem', fontFamily: 'inherit', letterSpacing: '-0.2px', mt: 0.5 }}>
                            Profile
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* New Meeting & Profile Section - Desktop Only */}
            {!isMobile && (
                <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        endIcon={<KeyboardArrowUpIcon />}
                        onClick={handleClick}
                        sx={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: '#FFFFFF', borderRadius: '24px', textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', py: 1.5, boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)', transition: 'all 0.3s ease', '&:hover': { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)', transform: 'translateY(-2px)' } }}>
                        New Meeting
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        PaperProps={{
                            sx: {
                                bgcolor: '#1C2230',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                mb: 1,
                                width: '220px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                '& .MuiMenuItem-root': {
                                    color: 'white',
                                    fontSize: '14px',
                                    py: 1.5,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleInstantMeeting}>
                            <ListItemIcon>
                                <FlashOnIcon fontSize="small" sx={{ color: '#6366F1' }} />
                            </ListItemIcon>
                            <ListItemText primary="Start instant meeting" />
                        </MenuItem>
                        <MenuItem onClick={handleScheduleMeeting}>
                            <ListItemIcon>
                                <CalendarMonthIcon fontSize="small" sx={{ color: '#8B5CF6' }} />
                            </ListItemIcon>
                            <ListItemText primary="Schedule for later" />
                        </MenuItem>
                    </Menu>
                    <Box sx={{ bgcolor: 'rgba(34, 43, 61, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '16px', p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, transition: 'all 0.3s ease', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(34, 43, 61, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', '& .profile-icon': { color: '#FFFFFF', bgcolor: '#6366F1' } } }}>
                        <Box className="profile-icon" sx={{ bgcolor: '#171C28', borderRadius: '12px', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                            <PersonOutlineIcon sx={{ color: '#94A3B8', fontSize: 20, transition: 'color 0.3s ease' }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}>{username}</Typography>
                            <Typography variant="caption" sx={{ color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 500 }}>Pro Plan</Typography>
                        </Box>
                        <IconButton onClick={handleLogout} size="small" sx={{ color: '#94A3B8', transition: 'all 0.3s ease', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)', transform: 'scale(1.1)' } }}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
