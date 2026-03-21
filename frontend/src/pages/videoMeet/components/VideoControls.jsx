import React from 'react';
import { IconButton, Badge } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatIcon from '@mui/icons-material/Chat';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import ClosedCaptionDisabledIcon from '@mui/icons-material/ClosedCaptionDisabled';

import PersonAddIcon from '@mui/icons-material/PersonAdd';

const VideoControls = ({
    video, audio, screen, screenAvailable, newMessages, showModal, captions,
    handleVideo, handleAudio, handleScreen, handleEndCall, setModal, handleCaptions,
    toggleMeetingInfo
}) => {
    return (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center flex-wrap gap-1 md:gap-3 bg-[#1C2230] px-3 md:px-6 py-1.5 md:py-3 rounded-full md:rounded-full z-50 shadow-2xl max-w-[98vw] md:max-w-none">
            <IconButton onClick={handleAudio} size="small" sx={{ p: { xs: 1, md: 1.5 }, color: audio ? '#ffffff' : '#ef4444', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {audio ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
            </IconButton>

            <IconButton onClick={handleVideo} size="small" sx={{ p: { xs: 1, md: 1.5 }, color: video ? '#ffffff' : '#ef4444', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {video ? <VideocamIcon fontSize="small" /> : <VideocamOffIcon fontSize="small" />}
            </IconButton>

            {screenAvailable && (
                <IconButton onClick={handleScreen} size="small" sx={{ p: { xs: 1, md: 1.5 }, color: screen ? '#818CF8' : '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    {screen ? <StopScreenShareIcon fontSize="small" /> : <ScreenShareIcon fontSize="small" />}
                </IconButton>
            )}

            <IconButton onClick={handleCaptions} size="small" sx={{ p: { xs: 1, md: 1.5 }, color: captions ? '#10B981' : '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {captions ? <ClosedCaptionIcon fontSize="small" /> : <ClosedCaptionDisabledIcon fontSize="small" />}
            </IconButton>

            <IconButton onClick={toggleMeetingInfo} size="small" title="Meeting Info" sx={{ p: { xs: 1, md: 1.5 }, color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: '#818CF8' } }}>
                <PersonAddIcon fontSize="small" />
            </IconButton>

            <IconButton
                onClick={handleEndCall}
                size="small"
                sx={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: { xs: '10px', md: '12px' },
                    '&:hover': { backgroundColor: '#dc2626' }
                }}
            >
                <CallEndIcon fontSize="small" />
            </IconButton>

            <Badge badgeContent={newMessages} color="error" max={99}>
                <IconButton
                    onClick={() => setModal(!showModal)}
                    size="small"
                    sx={{ p: { xs: 1, md: 1.5 }, color: showModal ? '#818CF8' : '#9CA3AF', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                    <ChatIcon fontSize="small" />
                </IconButton>
            </Badge>
        </div>
    );
};

export default VideoControls;
