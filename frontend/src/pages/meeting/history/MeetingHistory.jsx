import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Avatar, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MeetingHistory() {
    const navigate = useNavigate();
    const [pastMeetings, setPastMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const currentUserEmail = localStorage.getItem('email');

    useEffect(() => {
        const fetchMeetings = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/meetings/?token=${token}`);
                const now = new Date();
                const filtered = response.data.filter(m => {
                    const end = new Date(m.endTime);
                    return end < now;
                }).map(m => {
                    const start = new Date(m.startTime);
                    const end = new Date(m.endTime);
                    const durationInMinutes = Math.round((end - start) / 60000);

                    return {
                        ...m,
                        id: m.meetingCode,
                        date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        time: `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')}`,
                        duration: durationInMinutes > 60 ? `${(durationInMinutes / 60).toFixed(1)} hours` : `${durationInMinutes} mins`,
                        participantCount: Array.isArray(m.participants) ? m.participants.length : 0
                    };
                }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Sort most recent first

                setPastMeetings(filtered);
            } catch (error) {
                console.error('Error fetching meeting history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [token]);

    const handleBack = () => {
        navigate('/meetings');
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="#94A3B8">Loading History...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100%', bgcolor: 'transparent' }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconButton
                    onClick={handleBack}
                    sx={{
                        color: '#94A3B8',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#F8FAFC' }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                        Meeting History
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6366F1', fontWeight: 600 }}>
                        Review your past collaborations
                    </Typography>
                </Box>
            </Box>

            {pastMeetings.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 8,
                        p: 4,
                        bgcolor: 'rgba(34, 43, 61, 0.4)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '24px',
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <HistoryIcon sx={{ color: '#6366F1', fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 700, mb: 1 }}>
                        No Meetings Attended Yet
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94A3B8', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
                        You haven't participated in any recorded meetings yet. Once you complete a meeting, it will appear here for your records.
                    </Typography>

                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                    {pastMeetings.map((meeting) => (
                        <Paper
                            key={meeting.id}
                            sx={{
                                p: 3,
                                bgcolor: 'rgba(34, 43, 61, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: { xs: 2, md: 4 },
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(34, 43, 61, 0.6)',
                                    transform: 'translateX(8px)',
                                    borderColor: 'rgba(99, 102, 241, 0.3)'
                                }
                            }}
                        >
                            <Box sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366F1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <HistoryIcon fontSize="large" />
                            </Box>

                            <Box sx={{ flexGrow: 1, minWidth: '200px' }}>
                                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700, mb: 0.5 }}>
                                    {meeting.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span style={{ color: '#6366F1' }}>#{meeting.meetingCode}</span> • {meeting.description}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#E2E8F0', mb: 0.5 }}>
                                        <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{meeting.date}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
                                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                                        <Typography variant="caption">{meeting.time} ({meeting.duration})</Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={<GroupIcon sx={{ fontSize: '1rem !important', color: '#6366F1 !important' }} />}
                                    label={`${meeting.participantCount} Attended`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                                        color: '#6366F1',
                                        fontWeight: 800,
                                        borderRadius: '8px',
                                        px: 1
                                    }}
                                />
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
}
