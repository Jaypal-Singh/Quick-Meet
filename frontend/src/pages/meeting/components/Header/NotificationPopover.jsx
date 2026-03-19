import React from 'react';
import { 
    Popover, 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar, 
    Button, 
    Divider,
    IconButton,
    CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function NotificationPopover({ 
    anchorEl, 
    open, 
    onClose, 
    notifications, 
    setNotifications,
    loading,
    refreshMeetings
}) {
    const handleRespond = async (notificationId, action) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/v1/notifications/${notificationId}/respond`, null, {
                params: { action, token }
            });
            
            // Remove the notification from the list
            setNotifications(prev => prev.filter(n => (n._id || n.id) !== notificationId));
            
            // Refresh meetings to show updated status
            if (refreshMeetings) refreshMeetings();
            
        } catch (error) {
            console.error(`Error ${action}ing invite:`, error);
        }
    };

    const handleClearAll = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/v1/notifications/read-all?token=${token}`);
            setNotifications([]);
            onClose();
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/v1/notifications/${notificationId}/read?token=${token}`);
            setNotifications(prev => prev.filter(n => (n._id || n.id) !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    width: 360,
                    maxHeight: 480,
                    bgcolor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.1rem' }}>
                    Notifications
                </Typography>
                {notifications.length > 0 && (
                    <Button 
                        size="small" 
                        onClick={handleClearAll}
                        sx={{ color: '#6366F1', textTransform: 'none', fontWeight: 600 }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>

            {/* List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={24} sx={{ color: '#6366F1' }} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6, textAlign: 'center' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: 'rgba(148, 163, 184, 0.2)', mb: 2 }} />
                        <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>All caught up!</Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>No new notifications to show</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((n, i) => (
                            <React.Fragment key={n._id || n.id}>
                                <ListItem 
                                    sx={{ 
                                        flexDirection: 'column', 
                                        alignItems: 'stretch', 
                                        p: 2,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                                        <ListItemAvatar sx={{ minWidth: 48 }}>
                                            <Avatar sx={{ bgcolor: n.type === 'meeting_invite' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: n.type === 'meeting_invite' ? '#6366F1' : '#94A3B8' }}>
                                                {n.type === 'meeting_invite' ? <EventIcon fontSize="small" /> : <NotificationsIcon fontSize="small" />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Typography variant="subtitle2" sx={{ color: '#F8FAFC', fontWeight: 700, lineHeight: 1.2 }}>
                                                    {n.title}
                                                </Typography>
                                                <IconButton size="small" onClick={() => markAsRead(n._id || n.id)} sx={{ color: '#64748B', p: 0.5, mt: -0.5 }}>
                                                    <CloseIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem', mt: 0.5, lineHeight: 1.4 }}>
                                                {n.body}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {n.type === 'meeting_invite' && (
                                        <Box sx={{ display: 'flex', gap: 1, ml: 6 }}>
                                            <Button 
                                                variant="contained" 
                                                size="small"
                                                onClick={() => handleRespond(n._id, 'accept')}
                                                sx={{ 
                                                    bgcolor: '#6366F1', 
                                                    color: 'white', 
                                                    textTransform: 'none', 
                                                    fontWeight: 600,
                                                    boxShadow: 'none',
                                                    '&:hover': { bgcolor: '#4F46E5' }
                                                }}
                                            >
                                                Accept
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                onClick={() => handleRespond(n._id, 'reject')}
                                                sx={{ 
                                                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                                                    color: '#94A3B8', 
                                                    textTransform: 'none', 
                                                    fontWeight: 600,
                                                    '&:hover': { borderColor: 'rgba(255, 255, 255, 0.3)', bgcolor: 'transparent' }
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                </ListItem>
                                {i < notifications.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>
        </Popover>
    );
}
