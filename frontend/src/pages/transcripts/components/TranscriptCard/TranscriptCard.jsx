import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

export default function TranscriptCard({ title, badge, badgeColor, date, duration, participants, snippet }) {
    return (
        <Box
            sx={{
                bgcolor: 'rgba(34, 43, 61, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                p: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    bgcolor: 'rgba(34, 43, 61, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                            {title}
                        </Typography>
                        <Chip
                            label={badge}
                            size="small"
                            sx={{
                                bgcolor: `${badgeColor}20`,
                                color: badgeColor,
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                borderRadius: '6px',
                                border: `1px solid ${badgeColor}40`
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94A3B8' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                            <Typography variant="caption">{date}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                            <Typography variant="caption">{duration}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <PeopleOutlinedIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                            <Typography variant="caption">{participants} Participants</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        sx={{
                            bgcolor: 'rgba(34, 43, 61, 0.6)',
                            color: '#94A3B8',
                            '&:hover': { color: '#6366F1', bgcolor: 'rgba(99, 102, 241, 0.1)' }
                        }}
                    >
                        <FileDownloadOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        sx={{
                            bgcolor: 'rgba(34, 43, 61, 0.6)',
                            color: '#94A3B8',
                            '&:hover': { color: '#6366F1', bgcolor: 'rgba(99, 102, 241, 0.1)' }
                        }}
                    >
                        <ShareOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Box
                sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.4)',
                    p: 2.5,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.03)',
                    fontStyle: 'italic',
                    color: '#CBD5E1',
                    fontSize: '0.925rem',
                    lineHeight: 1.6
                }}
            >
                {snippet}
            </Box>
        </Box>
    );
}
