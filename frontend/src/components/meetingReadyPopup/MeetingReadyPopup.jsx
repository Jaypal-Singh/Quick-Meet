import React, { useState } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const MeetingReadyPopup = ({ meetingUrl, username, onClose }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(meetingUrl);
        setOpenSnackbar(true);
    };

    return (
        <div className="absolute bottom-[100px] left-6 w-[360px] p-6 rounded-xl z-[100] bg-[#1C2230] border border-white/10 shadow-2xl">
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Your meeting's ready</h2>
                <IconButton size="small" onClick={onClose} sx={{ color: '#9CA3AF' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>

            <button 
                disabled
                className="flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full px-4 py-2 text-sm font-medium mb-4 cursor-not-allowed opacity-60"
            >
                <PersonAddAlt1Icon fontSize="small" />
                Add others
            </button>

            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Or share this meeting link with others you want in the meeting
            </p>

            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 mb-4">
                <span className="flex-1 text-gray-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                    {meetingUrl}
                </span>
                <IconButton size="small" onClick={handleCopy} sx={{ color: '#9CA3AF', padding: '4px' }}>
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </div>

            {username && (
                <p className="text-gray-500 text-xs flex items-center gap-1.5">
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6.5C7.38071 6.5 8.5 5.38071 8.5 4C8.5 2.61929 7.38071 1.5 6 1.5C4.61929 1.5 3.5 2.61929 3.5 4C3.5 5.38071 4.61929 6.5 6 6.5ZM6 8C3.99661 8 0 9.00339 0 11.0034V12.5H12V11.0034C12 9.00339 8.00339 8 6 8Z" fill="#6B7280"/>
                    </svg>
                    Joined as {username}
                </p>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message="Meeting link copied!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            />
        </div>
    );
};

export default MeetingReadyPopup;
