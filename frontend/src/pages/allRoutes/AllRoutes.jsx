import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../landing';
import Authentication from '../authentication';
// import HomeComponent from '../home';
// import History from '../history';
import VideoMeetComponent from '../videoMeet/VideoMeet';
import Root from '../root/Root';
import Dashboard from '../dashboard/Dashboard';
import Meetings from '../meeting/Meetings';
import Summarise from '../summarise/summarise';
import Transcripts from '../transcripts/transcripts';
import Reports from '../reports/Reports';
import Settings from '../settings/settings';

export default function AllRoutes() {
    return (
        <Routes>
            {/* <Route path='/' element={<LandingPage />} /> */}
            <Route path='/' element={<Authentication />} />
            {/* <Route path='/home' element={<HomeComponent />} />
            <Route path='/history' element={<History />} /> */}

            {/* Pages with Sidebar Layout */}
            <Route element={<Root />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/summaries" element={<Summarise />} />
                <Route path="/transcripts" element={<Transcripts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Dynamic Video Meeting route */}
            <Route path='/:url' element={<VideoMeetComponent />} />
        </Routes>
    );
}
