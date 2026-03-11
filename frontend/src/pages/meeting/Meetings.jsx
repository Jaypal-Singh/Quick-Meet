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
                flexDirection: { xs: 'column', md: 'row' },
                height: { xs: 'auto', md: 'calc(100vh - 64px)' }, // Account for Root.jsx padding (32px top + 32px bottom)
                gap: { xs: 3, md: 4 } // Space between the left content and right sidebar
            }}
        >
            {/* Main Content Area (Left side) */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: { xs: 'visible', md: 'auto' }, // Allow native scroll on mobile
                    pr: { xs: 0, md: 1 }, // Padding right for scrollbar
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
                    width: { xs: '100%', md: 350 },
                    flexShrink: 0,
                    height: { xs: 'auto', md: '100%' },
                }}
            >
                <ScheduleSidebar />
            </Box>
        </Box>
    );
}
