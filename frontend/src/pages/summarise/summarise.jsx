import React from 'react';
import { Box } from '@mui/material';
import SummariseHeader from './components/SummariseHeader/SummariseHeader';
import FilterTabs from './components/FilterTabs/FilterTabs';
import PinnedSummary from './components/PinnedSummary/PinnedSummary';
import RecentMeetings from './components/RecentMeetings/RecentMeetings';
import Pagination from './components/Pagination/Pagination';

export default function Summarise() {
    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {/* Sticky Navigation Section */}
            <Box
                sx={{
                    position: 'sticky',
                    top: { xs: '-20px', md: '-28px' }, // Matches Root.jsx p: { xs: '20px 16px', md: '28px 32px' }
                    zIndex: 10,
                    bgcolor: 'var(--bg-root)',
                    pt: { xs: '20px', md: '28px' },
                    mt: '-8px', // Prevent gap
                    pb: 1,
                }}
            >
                <SummariseHeader />
                <FilterTabs />
            </Box>

            {/* Scrollable Content Area */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <PinnedSummary />
                <RecentMeetings />
                <Pagination />
            </Box>
        </Box>
    );
}
