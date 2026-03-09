import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Meetings() {
    return (
        <Box sx={{ color: 'white' }}>
            <Typography variant="h4" gutterBottom>Meetings</Typography>
            <Typography variant="body1">Your scheduled meetings will appear here.</Typography>
        </Box>
    );
}
