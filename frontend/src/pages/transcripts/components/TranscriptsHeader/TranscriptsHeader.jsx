import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

export default function TranscriptsHeader() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
                    Meeting Transcripts
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '1rem' }}>
                    Review and analyze your previous 24 conversations.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper
                        sx={{
                            bgcolor: 'rgba(34, 43, 61, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            p: '12px 20px',
                            minWidth: '120px'
                        }}
                    >
                        <Typography sx={{ color: '#6366F1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.5 }}>
                            TOTAL HOURS
                        </Typography>
                        <Typography sx={{ color: 'white', fontSize: '1.25rem', fontWeight: 800 }}>
                            42.5h
                        </Typography>
                    </Paper>

                    <Paper
                        sx={{
                            bgcolor: 'rgba(34, 43, 61, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            p: '12px 20px',
                            minWidth: '120px'
                        }}
                    >
                        <Typography sx={{ color: '#6366F1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.5 }}>
                            KEYWORDS IDENTIFIED
                        </Typography>
                        <Typography sx={{ color: 'white', fontSize: '1.25rem', fontWeight: 800 }}>
                            1.2k
                        </Typography>
                    </Paper>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<FileUploadOutlinedIcon />}
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1.2,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                        }
                    }}
                >
                    Import Audio
                </Button>
            </Box>
        </Box>
    );
}
