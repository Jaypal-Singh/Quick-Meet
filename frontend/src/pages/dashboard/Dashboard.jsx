import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {
    return (
        <Box sx={{ color: 'white' }}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Typography variant="body1">Welcome to MeetNext Pro Suite.</Typography>
        </Box>
    );
}
