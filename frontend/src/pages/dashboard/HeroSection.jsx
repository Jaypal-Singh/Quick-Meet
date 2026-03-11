import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [meetingCode, setMeetingCode] = useState("");
    const navigate = useNavigate();

    return (
        <Box sx={{
            position: 'relative', overflow: 'hidden', borderRadius: '16px',
            background: 'linear-gradient(180deg, #1C2230 0%, #131722 100%)', border: '1px solid rgba(255, 255, 255, 0.05)',
            minHeight: { xs: 'auto', md: '260px' }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }
        }}>
            {/* Left Content */}
            <Box sx={{
                width: { xs: '100%', md: '60%' }, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', p: { xs: 3, md: 5 }, position: 'relative', zIndex: 10
            }}>
                <Typography variant="h1" sx={{
                    fontSize: { xs: '32px', sm: '40px', md: '46px' }, fontWeight: 800, color: 'white',
                    lineHeight: 1.1, mb: 2, letterSpacing: '-0.5px'
                }}>
                    Connect{' '}
                    <Box component="span" sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                    }}>instantly</Box>
                    <br />from anywhere.
                </Typography>

                <Typography sx={{
                    color: '#9CA3AF', fontSize: { xs: '13px', md: '14px' }, lineHeight: 1.7,
                    mb: 4, maxWidth: '420px'
                }}>
                    Experience ultra-low latency, AI-enhanced audio, and seamless collaborative tools in one powerful meeting space.
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    {/* Enter meet link */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '999px',
                        px: 2, height: '44px', gap: 1, flexGrow: { xs: 1, sm: 0 }
                    }}>
                        <LinkIcon fontSize="small" sx={{ color: '#6B7280' }} />
                        <Box
                            component="input"
                            type="text"
                            placeholder="Enter meet code"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            sx={{
                                background: 'transparent', outline: 'none', border: 'none',
                                fontSize: '14px', color: 'white', width: '100%', minWidth: '90px'
                            }}
                        />
                    </Box>

                    {/* Join Call */}
                    <Button 
                        onClick={() => meetingCode && navigate(`/${meetingCode}`)}
                        sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: '#FFFFFF', fontWeight: 700,
                        px: 3, height: '44px', borderRadius: '999px',
                        fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)', textTransform: 'none', flexGrow: { xs: 1, sm: 0 },
                        '&:hover': { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)' }
                    }}>
                        Join Call
                    </Button>

                    {/* New Meeting */}
                    <Button 
                        onClick={() => navigate(`/${Math.random().toString(36).substring(2, 9)}`)}
                        sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white', fontWeight: 600, px: 2.5,
                        height: '44px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer', textTransform: 'none', flexGrow: { xs: 1, sm: 0 },
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                    }}>
                        <AddIcon fontSize="small" />
                        New Meeting
                    </Button>
                </Box>
            </Box>

            {/* Right Image */}
            <Box sx={{
                position: { xs: 'relative', md: 'absolute' }, right: 0, top: 0, bottom: 0,
                width: { xs: '100%', md: '45%' }, zIndex: 0, height: { xs: '160px', md: 'auto' }, mt: { xs: -2, md: 0 }, display: { xs: 'none', sm: 'block' }
            }}>
                <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                    alt="Team meeting"
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        borderRadius: isMobile ? '0 0 16px 16px' : '0 16px 16px 0', opacity: 0.6,
                        WebkitMaskImage: isMobile ? 'linear-gradient(to bottom, transparent 0%, black 100%)' : 'linear-gradient(to right, transparent 0%, black 40%)',
                        maskImage: isMobile ? 'linear-gradient(to bottom, transparent 0%, black 100%)' : 'linear-gradient(to right, transparent 0%, black 40%)'
                    }}
                />
            </Box>
        </Box>
    );
};

export default HeroSection;
