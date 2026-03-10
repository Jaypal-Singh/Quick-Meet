import React from 'react';
import { Box } from '@mui/material';
import Header from './components/Header/Header';
import Calendar from './components/Calendar/Calendar';
import PastMeetings from './components/PastMeetings/PastMeetings';
import ScheduleSidebar from './components/ScheduleSidebar/ScheduleSidebar';

export default function Meetings() {
    return (
        <Box
            sx={{
                display: 'flex',
                height: 'calc(100vh - 64px)', // Account for Root.jsx padding (32px top + 32px bottom)
                gap: 4 // Space between the left content and right sidebar
            }}
        >
            {/* Main Content Area (Left side) */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    pr: 1, // Padding right for scrollbar
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' },
                }}
            >
                <Header />
                <Calendar />
                <PastMeetings />
            </Box>

            {/* Sidebar Details Area (Right side) */}
            <Box
                sx={{
                    width: 350,
                    flexShrink: 0,
                    height: '100%',
                }}
            >
                <ScheduleSidebar />
            </Box>
        </Box>
    );
}
