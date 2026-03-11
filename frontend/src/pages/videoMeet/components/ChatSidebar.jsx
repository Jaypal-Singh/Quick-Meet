import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatSidebar = ({ showModal, setModal, messages, message, setMessage, sendMessage }) => {
    
    if (!showModal) return null;

    return (
        <div className="w-[400px] min-w-[400px] h-full bg-[#1C2230] flex flex-col border-l border-white/10 transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
                <h1 className="text-base font-medium text-white m-0">In-call messages</h1>
                <IconButton size="small" onClick={() => setModal(false)} sx={{ color: '#9CA3AF' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>

            {/* Info Banner */}
            <div className="bg-white/5 m-4 p-3 rounded-lg text-sm text-gray-400 text-center">
                <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs font-semibold mr-1">OFF</span>
                Messages won't be saved when the call ends.
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
                {messages.length !== 0 ? (
                    messages.map((item, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-semibold text-sm text-purple-400 mb-1">{item.sender}</p>
                            <p className="text-sm text-gray-300 bg-white/5 p-2.5 rounded-lg inline-block">{item.data}</p>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        No messages yet
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 flex gap-2 items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send a message"
                    onKeyDown={(e) => { if (e.key === 'Enter' && message.trim()) sendMessage(); }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition-colors"
                />
                <IconButton 
                    onClick={sendMessage} 
                    disabled={!message.trim()}
                    sx={{ 
                        color: message.trim() ? '#818CF8' : '#4B5563',
                        '&:hover': { backgroundColor: 'rgba(129, 140, 248, 0.1)' }
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </div>
        </div>
    );
};

export default ChatSidebar;
