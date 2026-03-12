import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Calendar from './components/Calendar/Calendar';
import PastMeetings from './components/PastMeetings/PastMeetings';
import ScheduleSidebar from './components/ScheduleSidebar/ScheduleSidebar';

export default function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const currentUserEmail = localStorage.getItem('email');

    const navigate = useNavigate();

    const fetchMeetings = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/meetings/?token=${token}`);
            const data = Array.isArray(response.data) ? response.data : [];
            const formattedMeetings = data.map(m => {
                const start = new Date(m.startTime);
                const end = new Date(m.endTime);
                
                // Safety check for invalid dates
                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    console.error('Invalid date found in meeting:', m);
                    return null;
                }

                const pad = (n) => n.toString().padStart(2, '0');
                const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
                const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
                const date = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;

                return {
                    ...m,
                    id: m.meetingCode, 
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    participants: Array.isArray(m.participants) ? m.participants.join(', ') : m.participants,
                    isHost: m.user_id === currentUserEmail,
                    color: 'rgba(99, 102, 241, 0.2)',
                    border: '#6366F1',
                    text: '#8B5CF6'
                };
            }).filter(Boolean);
            setMeetings(formattedMeetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, [token]);

    const handleScheduleMeeting = async (meetingData) => {
        try {
            const payload = {
                token: token,
                title: meetingData.title,
                description: meetingData.description,
                startTime: `${meetingData.date}T${meetingData.startTime}:00`,
                endTime: `${meetingData.date}T${meetingData.endTime}:00`,
                participants: meetingData.participants.split(',').map(p => p.trim()).filter(p => p !== '')
            };
            await axios.post('http://localhost:8000/api/v1/meetings/schedule', payload);
            fetchMeetings();
        } catch (error) {
            console.error('Error scheduling meeting:', error);
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    const handleUpdateMeeting = async (updatedMeeting) => {
        try {
            const payload = {
                token: token,
                title: updatedMeeting.title,
                description: updatedMeeting.description,
                startTime: `${updatedMeeting.date}T${updatedMeeting.startTime}:00`,
                endTime: `${updatedMeeting.date}T${updatedMeeting.endTime}:00`,
                participants: typeof updatedMeeting.participants === 'string'
                    ? updatedMeeting.participants.split(',').map(p => p.trim()).filter(p => p !== '')
                    : updatedMeeting.participants
            };
            await axios.put(`http://localhost:8000/api/v1/meetings/${updatedMeeting.id}`, payload);
            setIsEditModalOpen(false);
            setEditingMeeting(null);
            fetchMeetings();
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    const handleDeleteMeeting = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/meetings/${id}?token=${token}`);
            setIsEditModalOpen(false);
            setEditingMeeting(null);
            fetchMeetings();
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const handleOpenEditModal = (meeting) => {
        setEditingMeeting(meeting);
        setIsEditModalOpen(true);
    };

    const location = useLocation();
    const openSchedule = location.state?.openSchedule;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: { xs: 'auto', md: 'calc(100vh - 64px)' },
                gap: { xs: 3, md: 4 }
            }}
        >
            {/* Left/Main Column */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: { xs: 'visible', md: 'auto' },
                    pr: { xs: 0, md: 1 },
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' },
                }}
            >
                <Header
                    onSchedule={handleScheduleMeeting}
                    onUpdate={handleUpdateMeeting}
                    onDelete={handleDeleteMeeting}
                    editingMeeting={editingMeeting}
                    isEditModalOpen={isEditModalOpen}
                    onCloseEdit={() => { setIsEditModalOpen(false); setEditingMeeting(null); }}
                    autoOpenCreate={openSchedule}
                />

                <Calendar meetings={meetings} onEdit={handleOpenEditModal} />

                {/* Mobile: Show Upcoming section here (below calendar) */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
                    <ScheduleSidebar
                        meetings={meetings}
                        onEdit={handleOpenEditModal}
                    />
                </Box>

                {/* Desktop: Show Past Meetings here */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <PastMeetings meetings={meetings} />
                </Box>
            </Box>

            {/* Right/Sidebar Column (Desktop Only) */}
            <Box
                sx={{
                    width: { md: 350 },
                    flexShrink: 0,
                    height: '100%',
                    display: { xs: 'none', md: 'block' }
                }}
            >
                <ScheduleSidebar
                    meetings={meetings}
                    onEdit={handleOpenEditModal}
                />
            </Box>

            {/* Mobile: Show Past Meetings bottom-most */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, pb: 4 }}>
                <PastMeetings meetings={meetings} />
            </Box>
        </Box>
    );
}
