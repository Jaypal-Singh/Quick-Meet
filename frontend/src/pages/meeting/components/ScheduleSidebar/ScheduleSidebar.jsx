import React from 'react';
import { Box, Typography, Button, IconButton, Avatar, Chip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';

export default function ScheduleSidebar() {
    const participants = [
        { id: 'JD', name: 'Jane Doe', role: 'Host', status: 'Confirmed', color: 'success' },
        { id: 'MS', name: 'Michael Scott', role: 'Regional Manager', status: 'Pending', color: 'warning' },
        { id: 'PB', name: 'Pam Beesly', role: 'Designer', status: 'Declined', color: 'error' },
        { id: 'DW', name: 'Dwight Watson', role: 'Sales', status: 'Confirmed', color: 'success' },
    ];

    return (
        <Box
            sx={{
                height: '100%',
                bgcolor: 'rgba(23, 28, 40, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                p: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                    label="NEXT UP"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(99, 102, 241, 0.15)',
                        color: '#6366F1',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        letterSpacing: 1,
                        borderRadius: '6px'
                    }}
                />
                <IconButton size="small" sx={{ color: '#94A3B8' }}>
                    <MoreHorizIcon />
                </IconButton>
            </Box>

            <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 800, letterSpacing: '-0.5px', mb: 1 }}>
                Stakeholder Review
            </Typography>

            <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, mb: 3 }}>
                Reviewing the Q4 roadmap and finalizing budget allocations for the engineering department.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AccessTimeIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                        Today, 11:30 AM - 12:30 PM
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LinkIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#6366F1',
                            fontWeight: 600,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            '&:hover': { color: '#8B5CF6' }
                        }}
                    >
                        meetnext.io/stakeholder-rev-q4
                    </Typography>
                </Box>
            </Box>

            {/* Participants */}
            <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 800, letterSpacing: 1.5, mb: 1.5, display: 'block' }}>
                PARTICIPANTS (12)
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                flexGrow: 1,
                overflowY: 'auto',
                minHeight: 0,
                pr: 0.5,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' },
            }}>
                {participants.map((p) => (
                    <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#E2E8F0', width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
                            {p.id}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 700, lineHeight: 1.2 }}>
                                {p.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                                {p.role}
                            </Typography>
                        </Box>
                        <Chip
                            label={p.status}
                            size="small"
                            color={p.color}
                            sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: p.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.15)' :
                                    p.status === 'Pending' ? 'rgba(234, 179, 8, 0.15)' :
                                        'rgba(239, 68, 68, 0.15)',
                                color: p.status === 'Confirmed' ? '#22C55E' :
                                    p.status === 'Pending' ? '#EAB308' :
                                        '#EF4444',
                                '& .MuiChip-label': { px: 1 }
                            }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#6366F1',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 1.5,
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: '#4F46E5',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    Join Meeting
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#E2E8F0',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        py: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                    }}
                >
                    Edit Details
                </Button>
            </Box>
        </Box>
    );
}
