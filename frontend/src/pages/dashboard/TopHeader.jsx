import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const server = import.meta.env.VITE_API_URL;

const TopHeader = () => {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [tick, setTick] = useState(0); // Numeric tick for guaranteed re-renders
    const ref = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name') || 'User';
    const username = localStorage.getItem('username') || '';

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${server}/api/v1/notifications/`, { params: { token } });
            const sorted = (res.data || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setNotifications(sorted);
        } catch (e) {
            // silently ignore
        }
    };

    useEffect(() => {
        fetchNotifications();


        // Listen for real-time refresh event
        const handleRefresh = () => {
            console.log('TopHeader: Refreshing notifications due to real-time update');
            fetchNotifications();
        };

        window.addEventListener('refreshMeetings', handleRefresh);

        const interval = setInterval(fetchNotifications, 30000); // poll every 30s
        return () => {
            clearInterval(interval);
            window.removeEventListener('refreshMeetings', handleRefresh);
        };
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markRead = async (id) => {
        try {
            await axios.put(`${server}/api/v1/notifications/${id}/read`, null, { params: { token } });
            setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
        } catch (e) {/* ignore */ }
    };

    const markAllRead = async () => {
        try {
            await axios.put(`${server}/api/v1/notifications/read-all`, null, { params: { token } });
            setNotifications([]);
        } catch (e) {/* ignore */ }
    };

    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeAgo = (ts, currentTick) => {
        if (!ts) return '';
        const now = new Date();
        // Force UTC if no timezone is present to prevent local time mismatch
        const past = new Date(ts.includes('Z') || ts.includes('+') ? ts : ts + 'Z');
        const diffInSeconds = Math.floor((now - past) / 1000);

        // If clock skew makes it negative, or it's very fresh
        if (diffInSeconds <= 5) return 'Just now';
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 1 }}>
            {/* Left - Date */}
            <Typography sx={{ color: '#9CA3AF', fontSize: { xs: '12px', md: '14px' }, fontWeight: 500, whiteSpace: 'nowrap' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Typography>

            {/* Right - Bell + User */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2.5 } }}>

                {/* Notification Bell */}
                <Box ref={ref} sx={{ position: 'relative' }}>
                    <IconButton onClick={() => setOpen(o => !o)} sx={{ position: 'relative', color: '#9CA3AF', p: { xs: 0.5, sm: 1 } }}>
                        <NotificationsNoneOutlinedIcon fontSize="small" />
                        {unreadCount > 0 && (
                            <Box component="span" sx={{
                                position: 'absolute', top: { xs: '4px', sm: '6px' }, right: { xs: '4px', sm: '6px' },
                                width: '8px', height: '8px', backgroundColor: '#8B5CF6',
                                borderRadius: '50%'
                            }} />
                        )}
                    </IconButton>

                    {/* Dropdown */}
                    {open && (
                        <Box sx={{
                            position: 'absolute', top: '48px', right: 0, zIndex: 9999,
                            width: { xs: '300px', sm: '360px' },
                            background: 'linear-gradient(180deg, #1C2230 0%, #131722 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                            overflow: 'hidden',
                        }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>
                                    Notifications ({tick}s) {unreadCount > 0 && <Box component="span" sx={{ ml: 1, px: '6px', py: '2px', bgcolor: '#8B5CF620', color: '#8B5CF6', borderRadius: '10px', fontSize: '11px' }}>{unreadCount}</Box>}
                                </Typography>
                                {notifications.length > 0 && (
                                    <IconButton onClick={markAllRead} size="small" title="Clear all" sx={{ color: '#6B7280', '&:hover': { color: '#8B5CF6' } }}>
                                        <DoneAllIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            {/* List */}
                            <Box sx={{ maxHeight: '360px', overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' } }}>
                                {notifications.length === 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5, gap: 1 }}>
                                        <NotificationsNoneOutlinedIcon sx={{ color: '#374151', fontSize: 36 }} />
                                        <Typography sx={{ color: '#6B7280', fontSize: '13px' }}>No notifications</Typography>
                                    </Box>
                                ) : (
                                    notifications.map((n) => {
                                        const id = n.id || n._id;
                                        return (
                                            <Box
                                                key={id}
                                                sx={{
                                                    display: 'flex', alignItems: 'flex-start', gap: 1.5,
                                                    px: 2.5, py: 1.5,
                                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                    bgcolor: n.read ? 'transparent' : 'rgba(139,92,246,0.05)',
                                                    transition: 'background 0.2s',
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                                                }}
                                            >
                                                {/* Icon dot */}
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: n.read ? '#374151' : '#8B5CF6', flexShrink: 0, mt: '6px' }} />
                                                {/* Content */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>
                                                        {n.title}
                                                    </Typography>
                                                    <Typography sx={{ color: '#9CA3AF', fontSize: '12px', mt: '2px', lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {n.body}
                                                    </Typography>
                                                    <Typography sx={{ color: '#4B5563', fontSize: '11px', mt: '4px' }}>
                                                        {timeAgo(n.timestamp, tick)}
                                                    </Typography>
                                                </Box>
                                                {/* Action Buttons */}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
                                                    {n.type === 'meeting_invite' && n.data?.meeting_code && (
                                                        <IconButton
                                                            onClick={() => {
                                                                markRead(id);
                                                                navigate(`/video-meet?roomID=${n.data.meeting_code}`);
                                                            }}
                                                            size="small"
                                                            title="Join Meeting"
                                                            sx={{
                                                                color: '#8B5CF6',
                                                                bgcolor: 'rgba(139,92,246,0.1)',
                                                                '&:hover': { bgcolor: 'rgba(139,92,246,0.2)' }
                                                            }}
                                                        >
                                                            <VideocamOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                    {!n.read && (
                                                        <IconButton onClick={() => markRead(id)} size="small" title="Delete" sx={{ color: '#4B5563', '&:hover': { color: '#ef4444' } }}>
                                                            <CheckCircleOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, borderLeft: '1px solid #374151', pl: { xs: 1.5, sm: 2.5 }, cursor: 'pointer' }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: 'white', fontSize: { xs: '12px', md: '14px' }, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>{name}</Typography>
                        <Typography sx={{ color: '#8B5CF6', fontSize: { xs: '9px', md: '10px' }, fontWeight: 700, letterSpacing: '1px', margin: 0 }}>PREMIUM PLAN</Typography>
                    </Box>
                    <Box
                        component="img"
                        alt={name}
                        sx={{ width: { xs: '32px', sm: '36px' }, height: { xs: '32px', sm: '36px' }, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(139, 92, 246, 0.3)' }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TopHeader;
