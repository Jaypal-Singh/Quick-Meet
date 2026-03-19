import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import NotificationPopover from './NotificationPopover';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Header({ onSchedule, onUpdate, onDelete, onRefresh, editingMeeting, isEditModalOpen, onCloseEdit, autoOpenCreate }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            setLoadingNotifications(true);
            const response = await axios.get(`${API_URL}/api/v1/notifications?token=${token}`);
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (autoOpenCreate) {
            setIsCreateModalOpen(true);
        }
    }, [autoOpenCreate]);

    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    const handleOpenNotifications = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setNotificationAnchor(null);
    };

    const handleSchedule = async (meetingData) => {
        if (onSchedule) onSchedule(meetingData);
    };

    const handleUpdate = async (meetingData) => {
        if (onUpdate) onUpdate(meetingData);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, gap: 2, justifyContent: 'space-between', mb: { xs: 3, md: 4 } }}>
            {/* Search Bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(34, 43, 61, 0.4)',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    width: { xs: '100%', md: '400px' },
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    flexGrow: { xs: 1, md: 0 },
                    '&:focus-within': {
                        bgcolor: 'rgba(34, 43, 61, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                    }
                }}
            >
                <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />
                <InputBase
                    placeholder="Search meetings, participants..."
                    sx={{ color: '#E2E8F0', width: '100%', fontSize: '0.95rem' }}
                />
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                    onClick={handleOpenNotifications}
                    sx={{
                        bgcolor: 'rgba(34, 43, 61, 0.6)',
                        color: notifications.length > 0 ? '#6366F1' : '#94A3B8',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                            bgcolor: 'rgba(34, 43, 61, 0.9)',
                            color: '#E2E8F0',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Badge 
                        badgeContent={notifications.length} 
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                bgcolor: '#EF4444',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                minWidth: '16px',
                                height: '16px',
                                padding: '0 4px'
                            }
                        }}
                    >
                        {notifications.length > 0 ? <NotificationsIcon fontSize="small" /> : <NotificationsNoneIcon fontSize="small" />}
                    </Badge>
                </IconButton>

                <NotificationPopover 
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleCloseNotifications}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    loading={loadingNotifications}
                    refreshMeetings={onRefresh}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 2.5, sm: 3 },
                        py: 1,
                        flexGrow: { xs: 1, sm: 0 },
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    Schedule New Meeting
                </Button>
            </Box>

            {/* Create Meeting Modal */}
            <ScheduleMeetingModal 
                open={isCreateModalOpen} 
                onClose={handleCloseCreateModal} 
                onSchedule={handleSchedule} 
            />

            {/* Edit Meeting Modal */}
            <ScheduleMeetingModal 
                open={isEditModalOpen} 
                onClose={onCloseEdit} 
                onSchedule={handleUpdate}
                onDelete={onDelete}
                initialData={editingMeeting}
            />
        </Box>
    );
}
