import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    InputAdornment,
    Fade,
    Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ScheduleMeetingModal = ({ open, onClose, onSchedule, onDelete, initialData }) => {
    const [meetingData, setMeetingData] = useState({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        participants: ''
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (open) {
            setShowDeleteConfirm(false);
            if (initialData) {
                setMeetingData({
                    id: initialData.id,
                    title: initialData.title || '',
                    description: initialData.description || '',
                    date: initialData.date || '',
                    startTime: initialData.startTime || '',
                    endTime: initialData.endTime || '',
                    participants: initialData.participants || ''
                });
            } else {
                setMeetingData({
                    title: '',
                    description: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    participants: ''
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeetingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSchedule(meetingData);
        onClose();
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete && meetingData.id) {
            onDelete(meetingData.id);
            setShowDeleteConfirm(false);
            onClose();
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                TransitionComponent={Fade}
                transitionDuration={400}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(12px)',
                    }
                }}
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(30, 41, 59, 0.95)',
                        backgroundImage: 'none',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h5" fontWeight="700" color="#F8FAFC">
                        {initialData ? 'Edit Meeting' : 'Schedule New Meeting'}
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#94A3B8', '&:hover': { color: '#F8FAFC', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Meeting Title"
                            name="title"
                            value={meetingData.title}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder="e.g. Project Sync"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TitleIcon sx={{ color: '#6366F1' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyle}
                        />

                        <TextField
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            value={meetingData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EventIcon sx={{ color: '#6366F1' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyle}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                name="startTime"
                                type="time"
                                value={meetingData.startTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon sx={{ color: '#6366F1' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyle}
                            />
                            <TextField
                                fullWidth
                                label="End Time"
                                name="endTime"
                                type="time"
                                value={meetingData.endTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon sx={{ color: '#6366F1' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyle}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Agenda / Description"
                            name="description"
                            value={meetingData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            placeholder="What is this meeting about?"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                        <DescriptionIcon sx={{ color: '#6366F1' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyle}
                        />

                        <TextField
                            fullWidth
                            label="Participants (Emails)"
                            name="participants"
                            value={meetingData.participants}
                            onChange={handleChange}
                            placeholder="Enter email addresses separated by commas"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <GroupIcon sx={{ color: '#6366F1' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyle}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        {initialData && (
                            <Button
                                onClick={handleDelete}
                                startIcon={<DeleteOutlineIcon />}
                                sx={{
                                    color: '#EF4444',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                                }}
                            >
                                Delete Meeting
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                            onClick={onClose}
                            sx={{ color: '#94A3B8', textTransform: 'none', fontWeight: 600 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1.2,
                                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                                }
                            }}
                        >
                            {initialData ? 'Update Meeting' : 'Schedule Meeting'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(30, 41, 59, 1)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        p: 1,
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#94A3B8' }}>
                        Are you sure you want to delete this meeting? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button 
                        onClick={() => setShowDeleteConfirm(false)}
                        sx={{ color: '#94A3B8', textTransform: 'none', fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete}
                        variant="contained"
                        sx={{ 
                            bgcolor: '#EF4444', 
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#DC2626' }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
        color: '#E2E8F0',
        borderRadius: '12px',
        bgcolor: 'rgba(15, 23, 42, 0.3)',
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
        '&.Mui-focused fieldset': { borderColor: '#6366F1' },
        '& input[type="date"], & input[type="time"]': {
            colorScheme: 'dark', // This makes the native picker dark
            cursor: 'pointer',
        },
        '& input::-webkit-calendar-picker-indicator': {
            filter: 'invert(0.6) sepia(1) saturate(5) hue-rotate(175deg)', // Makes the native icon match our purple/indigo theme
            cursor: 'pointer',
            opacity: 0.8,
            '&:hover': {
                opacity: 1,
            }
        }
    },
    '& .MuiInputLabel-root': { color: '#94A3B8' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
    '& .MuiOutlinedInput-input::placeholder': { color: '#64748B', opacity: 1 },
};

export default ScheduleMeetingModal;
