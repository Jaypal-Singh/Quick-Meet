import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Avatar, 
    IconButton, 
    InputAdornment, 
    CircularProgress,        
    Fade,
    Paper,
    Snackbar,
    Alert,
    Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamIcon from '@mui/icons-material/Videocam';
import axios from 'axios';
import server from '../../environment';
import TopHeader from '../dashboard/TopHeader';

export default function Friends() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchFriends();
    }, []);

    const handleMeet = async (friendUsername) => {
        const meetingCode = Math.random().toString(36).substring(2, 10);
        setNotification({ open: true, message: "Sending invite...", severity: "info" });
        try {
            await axios.post(`${server}/api/v1/friends/invite`, {
                token,
                friend_username: friendUsername,
                meeting_code: meetingCode
            });
            // Redirect to meeting with state
            navigate(`/video-meet?roomID=${meetingCode}`, { state: { inviteSent: true } });
        } catch (error) {
            console.error("Error sending invite:", error);
            // Even if notification fails, we still want to join the meeting
            navigate(`/video-meet?roomID=${meetingCode}`, { state: { inviteSent: false, error: "Failed to send notification" } });
        }
    };

    const fetchFriends = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${server}/api/v1/friends/list`, {
                params: { token }
            });
            setFriends(response.data);
        } catch (error) {
            console.error("Error fetching friends:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await axios.get(`${server}/api/v1/friends/search`, {
                params: { query }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setSearching(false);
        }
    };

    const addFriend = async (friendUsername) => {
        try {
            const response = await axios.post(`${server}/api/v1/friends/add`, {
                token,
                friend_username: friendUsername
            });
            setNotification({ open: true, message: response.data.message, severity: "success" });
            fetchFriends();
            setSearchResults([]);
            setSearchQuery("");
        } catch (error) {
            setNotification({ 
                open: true, 
                message: error.response?.data?.detail || "Failed to add friend", 
                severity: "error" 
            });
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, color: 'white', maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 0 } }}>
            <TopHeader />

            {/* Header Section */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Friends Network
                </Typography>
                <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                    Connect with your teammates and start instant meetings.
                </Typography>
            </Box>

            {/* Search Section */}
            <Box sx={{ position: 'relative', zIndex: 10 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by username or name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#6366F1' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            bgcolor: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '16px',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            '& fieldset': { border: 'none' },
                            '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.8)' },
                        }
                    }}
                />

                {/* Search Results Dropdown */}
                {searchQuery.length >= 2 && (
                    <Paper 
                        sx={{ 
                            position: 'absolute', 
                            top: '100%', 
                            left: 0, 
                            right: 0, 
                            mt: 1, 
                            bgcolor: '#1E293B', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            color: 'white',
                            zIndex: 100,
                            p: 1
                        }}
                    >
                        {searching ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress size={24} sx={{ color: '#6366F1' }} />
                            </Box>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <Box 
                                    key={user.username}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        p: 1.5,
                                        borderRadius: '12px',
                                        '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#6366F1' }}>{user.name[0]}</Avatar>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>@{user.username}</Typography>
                                        </Box>
                                    </Box>
                                    <Button 
                                        variant="contained" 
                                        size="small"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => addFriend(user.username)}
                                        sx={{ 
                                            borderRadius: '8px', 
                                            textTransform: 'none',
                                            bgcolor: '#6366F1',
                                            '&:hover': { bgcolor: '#4F46E5' }
                                        }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center', color: '#94A3B8' }}>
                                No users found
                            </Box>
                        )}
                    </Paper>
                )}
            </Box>

            {/* Friends List Section */}
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    Your Friends <Box sx={{ fontSize: '0.75rem', bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', px: 1.5, py: 0.5, borderRadius: '12px' }}>{friends.length}</Box>
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#6366F1' }} />
                    </Box>
                ) : friends.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {friends.map((friend, index) => (
                            <Fade in={true} timeout={300 + index * 50} key={friend.username}>
                                <Paper sx={{ 
                                    bgcolor: 'rgba(30, 41, 59, 0.4)', 
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        bgcolor: 'rgba(30, 41, 59, 0.6)',
                                        borderColor: 'rgba(99, 102, 241, 0.4)',
                                        boxShadow: '0 0 25px rgba(99, 102, 241, 0.15)',
                                        '& .friend-avatar': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                                        }
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar 
                                            className="friend-avatar"
                                            sx={{ 
                                                width: 48, 
                                                height: 48, 
                                                background: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`,
                                                fontSize: '1.2rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                                transition: 'all 0.4s ease'
                                            }}
                                        >
                                            {friend.name[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.2 }}>{friend.name}</Typography>
                                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>@{friend.username}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Button 
                                            variant="contained" 
                                            startIcon={<VideocamIcon style={{ fontSize: 18 }} />}
                                            onClick={() => handleMeet(friend.username)}
                                            sx={{ 
                                                borderRadius: '10px', 
                                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                                color: '#818CF8',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 2.5,
                                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                                '&:hover': { 
                                                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                                    color: 'white',
                                                    borderColor: 'transparent'
                                                }
                                            }}
                                        >
                                            Meet
                                        </Button>
                                        <IconButton 
                                            sx={{ 
                                                bgcolor: 'rgba(255,255,255,0.03)', 
                                                borderRadius: '10px',
                                                color: '#94A3B8',
                                                '&:hover': { color: 'white', bgcolor: 'rgba(99, 102, 241, 0.15)' }
                                            }}
                                        >
                                            <ChatBubbleOutlineIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" sx={{ color: '#475569' }}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            </Fade>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 12, 
                        bgcolor: 'rgba(30, 41, 59, 0.2)', 
                        borderRadius: '24px',
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <Typography variant="h6" sx={{ color: '#94A3B8', mb: 2 }}>You haven't added any friends yet</Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Use the search bar above to find and connect with people.</Typography>
                    </Box>
                )}
            </Box>

            {/* Notification Snackbar */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={4000} 
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                    sx={{ borderRadius: '12px', bgcolor: notification.severity === 'success' ? '#10B981' : '#EF4444', color: 'white' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
