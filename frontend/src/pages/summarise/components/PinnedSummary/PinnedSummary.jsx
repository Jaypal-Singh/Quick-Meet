import React from 'react';
import { Box, Typography, Chip, Button, Avatar, AvatarGroup, IconButton } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';

export default function PinnedSummary() {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PushPinIcon sx={{ color: '#6366F1', fontSize: 18 }} />
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                    Pinned Summaries
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                bgcolor: 'rgba(34, 43, 61, 0.4)', // Matching PastMeetings card bg
                borderRadius: '16px',
                p: { xs: 2, md: 2.5 },
                border: '1px solid rgba(255, 255, 255, 0.05)',
                gap: { xs: 2, md: 3 }
            }}>
                {/* Left Side: Video/Image thumbnail representation */}
                <Box sx={{
                    width: { xs: '100%', md: '30%' },
                    bgcolor: '#2D3748', // Placeholder thumbnail color
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: { xs: '150px', md: '180px' }
                }}>
                    <Chip
                        label="URGENT FOLLOW-UP"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            bgcolor: '#EF4444',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            letterSpacing: 0.5,
                            borderRadius: '4px',
                            height: '22px'
                        }}
                    />

                    {/* Avatars at bottom of thumbnail */}
                    <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.8rem', borderColor: '#2D3748' } }}>
                            <Avatar src="/avatars/1.jpg" />
                            <Avatar src="/avatars/2.jpg" />
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>+3</Avatar>
                        </AvatarGroup>
                    </Box>
                </Box>

                {/* Right Side: Content */}
                <Box sx={{ width: { xs: '100%', md: '70%' }, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 800, letterSpacing: 1 }}>
                            PRODUCT STRATEGY
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500, textAlign: 'right' }}>
                            Oct 24, 2023 • 45m
                        </Typography>
                    </Box>

                    <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 800, mb: 1.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        Product Roadmap Q4 Planning
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, mb: 3 }}>
                        The team finalized the key milestones for the Q4 release. Main focus is on the mobile UI overhaul and integration of the new AI transcription engine. Resource allocation was the primary blocker identified.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#6366F1',
                                color: '#FFFFFF',
                                fontWeight: 700,
                                borderRadius: '20px',
                                textTransform: 'none',
                                px: 3,
                                py: { xs: 0.8, md: 1 },
                                fontSize: { xs: '0.85rem', md: '0.875rem' },
                                '&:hover': { bgcolor: '#4F46E5' },
                                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
                                flexGrow: { xs: 1, md: 0 }
                            }}
                        >
                            View Transcript
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ShareOutlinedIcon />}
                            sx={{
                                color: '#E2E8F0',
                                borderColor: 'transparent',
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                fontWeight: 600,
                                borderRadius: '20px',
                                textTransform: 'none',
                                px: 2,
                                fontSize: { xs: '0.85rem', md: '0.875rem' },
                                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.1)', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                                flexGrow: { xs: 1, md: 0 }
                            }}
                        >
                            Share
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<VideocamOutlinedIcon />}
                            sx={{
                                color: '#E2E8F0',
                                borderColor: 'transparent',
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                fontWeight: 600,
                                borderRadius: '20px',
                                textTransform: 'none',
                                px: 2,
                                fontSize: { xs: '0.85rem', md: '0.875rem' },
                                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.1)', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                                flexGrow: { xs: 1, md: 0 }
                            }}
                        >
                            Recording
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
