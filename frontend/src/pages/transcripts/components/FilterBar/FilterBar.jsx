import React from 'react';
import { Box, InputBase, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function FilterBar() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Search Input */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(34, 43, 61, 0.4)',
                    borderRadius: '16px',
                    px: 3,
                    py: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:focus-within': {
                        bgcolor: 'rgba(34, 43, 61, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                    }
                }}
            >
                <SearchIcon sx={{ color: '#6366F1', mr: 2, fontSize: 22 }} />
                <InputBase
                    placeholder="Search through meeting content, speakers, or topics..."
                    sx={{ color: '#E2E8F0', width: '100%', fontSize: '1rem' }}
                />
            </Box>

            {/* Filter Chips */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                    icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                    label="All Dates"
                    onDelete={() => { }}
                    deleteIcon={<KeyboardArrowDownIcon />}
                    sx={chipStyle}
                />
                <Chip
                    icon={<AccessTimeOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                    label="Duration"
                    onDelete={() => { }}
                    deleteIcon={<KeyboardArrowDownIcon />}
                    sx={chipStyle}
                />
                <Chip
                    icon={<PeopleOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                    label="Participants"
                    onDelete={() => { }}
                    deleteIcon={<KeyboardArrowDownIcon />}
                    sx={chipStyle}
                />
                <Chip
                    icon={<TagOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                    label="Keywords"
                    onDelete={() => { }}
                    deleteIcon={<KeyboardArrowDownIcon />}
                    sx={chipStyle}
                />

                <Box sx={{ height: '24px', width: '1px', bgcolor: 'rgba(255,255,255,0.1)', mx: 1 }} />

                <Button
                    sx={{
                        color: '#6366F1',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' }
                    }}
                >
                    Clear Filters
                </Button>
            </Box>
        </Box>
    );
}

const chipStyle = {
    bgcolor: 'rgba(34, 43, 61, 0.6)',
    color: '#E2E8F0',
    borderRadius: '12px',
    height: '40px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    px: 1,
    '& .MuiChip-icon': { color: '#6366F1' },
    '& .MuiChip-deleteIcon': { color: '#94A3B8', fontSize: '18px' },
    '&:hover': { bgcolor: 'rgba(34, 43, 61, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }
};
