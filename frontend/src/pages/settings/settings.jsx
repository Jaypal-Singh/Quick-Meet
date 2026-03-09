import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Settings() {
    return (
        <Box sx={{ color: 'white' }}>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Typography variant="body1">Manage your account and preferences.</Typography>
        </Box>
    );
}
