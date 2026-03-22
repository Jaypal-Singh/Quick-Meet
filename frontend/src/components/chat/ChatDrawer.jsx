import React, { useState, useEffect, useRef } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Avatar,
    TextField,
    CircularProgress,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axiosInstance from '../../utils/axiosInstance';
import { useSocket } from '../../context/SocketContext';

export default function ChatDrawer({ open, onClose, friend }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const socket = useSocket();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Get current username directly from local storage
    const currentUsername = localStorage.getItem('username');

    useEffect(() => {
        if (open && friend) {
            fetchChatHistory();
        }
    }, [open, friend]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            // Only add if it's relevant to the current active chat
            if (!friend) return;
            
            const isRelevant = 
                (data.sender_username === friend.username && data.receiver_username === currentUsername) ||
                (data.sender_username === currentUsername && data.receiver_username === friend.username);
                
            if (isRelevant) {
                setMessages(prev => [...prev, data]);
                scrollToBottom();
            }
        };

        socket.on('receive-chat-message', handleReceiveMessage);

        return () => {
            socket.off('receive-chat-message', handleReceiveMessage);
        };
    }, [socket, friend, currentUsername]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatHistory = async () => {
        if (!friend) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/v1/chat/list/${friend.username}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching chat history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = async () => {
        try {
            await axiosInstance.delete(`/api/v1/chat/clear/${friend.username}`);
            setMessages([]);
        } catch (err) {
            console.error("Failed to clear chat:", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !friend) return;

        try {
            // Optimistic update optional, but backend responds with the saved message
            // which will also be caught by socket if we want. But socket already emits
            // back to the sender, so we just clear input and wait for socket,
            // or push optimistic and deduplicate. Let's just rely on socket emitting back to sender!
            // Wait, socket emitting back to sender might be delayed. 
            // Better to push to state immediately and avoid dups.
            const messageText = newMessage.trim();
            setNewMessage(""); 
            
            const tempMessage = {
                sender_username: currentUsername,
                receiver_username: friend.username,
                content: messageText,
                timestamp: new Date().toISOString()
            };
            
            // Add optimistic
            setMessages(prev => [...prev, tempMessage]);
            
            await axiosInstance.post('/api/v1/chat/send', {
                receiver_username: friend.username,
                content: messageText
            });

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: isMobile ? '100%' : 400,
                    bgcolor: '#0F172A',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'white'
                }
            }}
        >
            {friend && (
                <>
                    {/* Header */}
                    <Box sx={{ 
                        p: 2.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                                bgcolor: '#6366F1',
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }}>
                                {friend.name ? friend.name[0] : friend.username[0].toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {friend.name || friend.username}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <IconButton 
                                onClick={handleClearChat}
                                title="Clear Chat History"
                                sx={{ 
                                    color: '#94A3B8', 
                                    mr: 1,
                                    '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)' } 
                                }}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                            <IconButton onClick={onClose} sx={{ color: '#94A3B8', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Chat Area */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        overflowY: 'auto', 
                        p: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 1.5,
                        bgcolor: '#0B1121'
                    }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress sx={{ color: '#6366F1' }} size={30} />
                            </Box>
                        ) : messages.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 10, color: '#64748B' }}>
                                <Typography variant="body2">No messages yet. Say hi!</Typography>
                            </Box>
                        ) : (
                            messages.map((msg, index) => {
                                // Deduplicate logic relies on index key or timestamp
                                const isMe = msg.sender_username === currentUsername;
                                return (
                                    <Fade in={true} key={msg._id || index}>
                                        <Box sx={{ 
                                            maxWidth: '75%', 
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            bgcolor: isMe ? '#6366F1' : 'rgba(30, 41, 59, 0.8)',
                                            color: 'white',
                                            p: 1.5,
                                            px: 2,
                                            borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}>
                                            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                                {msg.content}
                                            </Typography>
                                            <Typography variant="caption" sx={{ 
                                                display: 'block', 
                                                textAlign: isMe ? 'right' : 'left', 
                                                mt: 0.5, 
                                                color: isMe ? 'rgba(255,255,255,0.7)' : '#94A3B8',
                                                fontSize: '0.65rem'
                                            }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box component="form" onSubmit={handleSendMessage} sx={{ 
                        p: 2, 
                        bgcolor: '#0F172A',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'center'
                    }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(30, 41, 59, 0.6)',
                                    borderRadius: '24px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: '1px solid rgba(99, 102, 241, 0.5)' }
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '12px 20px'
                                }
                            }}
                        />
                        <IconButton 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            sx={{ 
                                bgcolor: newMessage.trim() ? '#6366F1' : 'rgba(255,255,255,0.05)', 
                                color: 'white',
                                borderRadius: '50%',
                                p: 1.2,
                                '&:hover': { bgcolor: newMessage.trim() ? '#4F46E5' : 'rgba(255,255,255,0.1)' },
                                '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            <SendIcon fontSize="small" sx={{ ml: 0.3 }} />
                        </IconButton>
                    </Box>
                </>
            )}
        </Drawer>
    );
}
