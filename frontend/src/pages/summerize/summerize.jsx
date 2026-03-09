import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Summarize() {
    return (
        <Box sx={{ color: 'white' }}>
            <Typography variant="h4" gutterBottom>Summaries</Typography>
            <Typography variant="body1">View AI generated meeting summaries here.</Typography>
        </Box>
    );
}
