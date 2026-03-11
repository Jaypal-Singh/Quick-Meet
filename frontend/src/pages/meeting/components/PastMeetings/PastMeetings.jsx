import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HistoryIcon from '@mui/icons-material/History';

export default function PastMeetings() {
    const pastMeetings = [
        {
            id: 1,
            title: 'Weekly Marketing Sync',
            date: 'Oct 3, 2023',
            duration: '45 mins',
            participants: 8
        },
        {
            id: 2,
            title: 'Quarterly Business Review',
            date: 'Oct 1, 2023',
            duration: '2 hours',
            participants: 15
        }
    ];

    return (
        <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                    Past Meetings
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#6366F1',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        '&:hover': { color: '#8B5CF6', '& .arrow': { transform: 'translateX(4px)' } }
                    }}
                >
                    View All History
                    <ArrowForwardIcon className="arrow" fontSize="small" sx={{ transition: 'transform 0.2s' }} />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                {pastMeetings.map((meeting) => (
                    <Box
                        key={meeting.id}
                        sx={{
                            flex: 1,
                            bgcolor: 'rgba(34, 43, 61, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            p: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2.5,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'rgba(34, 43, 61, 0.8)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                '& .icon-box': {
                                    bgcolor: '#6366F1',
                                    color: '#FFFFFF'
                                }
                            }
                        }}
                    >
                        <Box
                            className="icon-box"
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366F1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <HistoryIcon />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" sx={{ color: '#F8FAFC', fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                                {meeting.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                                {meeting.date} • {meeting.duration} • {meeting.participants} participants
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
