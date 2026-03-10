import React from 'react';
import TopHeader from './TopHeader';
import HeroSection from './HeroSection';
import UpcomingMeetings from './UpcomingMeetings';
import InsightsSidebar from './InsightsSidebar';
import RecentSummaries from './RecentSummaries';

export default function Dashboard() {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', color: 'white' }}>
            {/* Top Header */}
            <TopHeader />

            {/* Hero Banner - Full Width */}
            <HeroSection />

            {/* Bottom Section: Left (Meetings + Summaries) | Right (Insights) */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Left Column */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <UpcomingMeetings />
                    <RecentSummaries />
                </div>

                {/* Right Column - Insights Sidebar */}
                <div style={{ width: '320px', flexShrink: 0 }}>
                    <InsightsSidebar />
                </div>
            </div>
        </div>
    );
}
