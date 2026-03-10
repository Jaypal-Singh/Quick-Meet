import React from 'react';
import { Box } from '@mui/material';
import TranscriptsHeader from './components/TranscriptsHeader/TranscriptsHeader';
import FilterBar from './components/FilterBar/FilterBar';
import TranscriptCard from './components/TranscriptCard/TranscriptCard';
import Pagination from './components/Pagination/Pagination';

const MOCK_TRANSCRIPTS = [
    {
        id: 1,
        title: 'Q3 Marketing Strategy Session',
        badge: 'STRATEGIC',
        badgeColor: '#10B981',
        date: 'Oct 12, 2023',
        duration: '54 min',
        participants: 5,
        snippet: '"...our priority for the next quarter should be focusing on the retention metrics. Sarah, I think the data you showed regarding the mobile app usage is key. If we can increase the daily active users by just 15%, the LTV will follow..."'
    },
    {
        id: 2,
        title: 'Weekly Sprint Planning',
        badge: 'RECURRING',
        badgeColor: '#8B5CF6',
        date: 'Oct 10, 2023',
        duration: '30 min',
        participants: 8,
        snippet: '"...the migration to the new database is scheduled for Tuesday morning. We\'ll have a brief downtime from 2:00 to 4:00 AM UTC. Mark, please ensure the backups are verified before the process starts..."'
    },
    {
        id: 3,
        title: 'Client Onboarding: TechSolutions Inc.',
        badge: 'EXTERNAL',
        badgeColor: '#F59E0B',
        date: 'Oct 08, 2023',
        duration: '1h 12min',
        participants: 3,
        snippet: '"...thank you for choosing MeetNext. To get started, we\'ll need your team to configure the API keys in the dashboard. I\'ll walk you through the security settings now. First, navigate to the developer tab..."'
    },
    {
        id: 4,
        title: 'Project Apollo Refinement',
        badge: 'PROJECT',
        badgeColor: '#3B82F6',
        date: 'Oct 05, 2023',
        duration: '45 min',
        participants: 4,
        snippet: '"...the UI mockups look great, but the contrast on the secondary buttons needs adjustment for accessibility. Let\'s aim for a 4.5:1 ratio. I\'ve sent the updated palette to the Slack channel..."'
    }
];

export default function Transcripts() {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TranscriptsHeader />
            <FilterBar />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {MOCK_TRANSCRIPTS.map((transcript) => (
                    <TranscriptCard key={transcript.id} {...transcript} />
                ))}
            </Box>

            <Box sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                    Showing 4 of 24 transcripts
                </Box>
                <Pagination />
            </Box>
        </Box>
    );
}
