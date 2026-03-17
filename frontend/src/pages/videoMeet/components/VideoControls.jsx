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

const VideoControls = ({
    video, audio, screen, screenAvailable, newMessages, showModal,
    handleVideo, handleAudio, handleScreen, handleEndCall, setModal
}) => {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1C2230]/95 backdrop-blur-md px-6 py-3 rounded-full z-50 shadow-xl border border-white/10">

            <IconButton onClick={handleAudio} sx={{ color: audio ? '#ffffff' : '#ef4444', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton onClick={handleVideo} sx={{ color: video ? '#ffffff' : '#ef4444', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            {screenAvailable && (
                <IconButton onClick={handleScreen} sx={{ color: screen ? '#818CF8' : '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                </IconButton>
            )}

            <IconButton
                onClick={handleEndCall}
                sx={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '12px',
                    '&:hover': { backgroundColor: '#dc2626' }
                }}
            >
                <CallEndIcon />
            </IconButton>

            <Badge badgeContent={newMessages} color="error" max={99}>
                <IconButton
                    onClick={() => setModal(!showModal)}
                    sx={{ color: showModal ? '#818CF8' : '#9CA3AF', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                    <ChatIcon />
                </IconButton>
            </Badge>
        </div>
    );
};

export default VideoControls;
