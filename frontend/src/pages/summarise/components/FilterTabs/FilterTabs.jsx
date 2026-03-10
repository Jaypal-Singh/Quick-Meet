import React, { useState } from 'react';
import { Box, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export default function FilterTabs() {
    const [activeTab, setActiveTab] = useState('All Summaries');

    const tabs = [
        { label: 'All Summaries', hasDropdown: false },
        { label: 'Last 7 Days', hasDropdown: false },
        { label: 'Personal', hasDropdown: true },
        { label: 'Team', hasDropdown: true },
        { label: 'Starred', icon: <StarBorderIcon fontSize="small" />, activeIcon: <StarIcon fontSize="small" sx={{ color: '#FCD34D' }} /> },
    ];

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                    <Chip
                        key={tab.label}
                        label={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        icon={isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
                        deleteIcon={tab.hasDropdown ? <KeyboardArrowDownIcon /> : undefined}
                        onDelete={tab.hasDropdown ? () => { } : undefined}
                        sx={{
                            bgcolor: isActive ? '#6366F1' : 'rgba(34, 43, 61, 0.6)',
                            color: isActive ? '#FFFFFF' : '#E2E8F0',
                            fontWeight: isActive ? 700 : 500,
                            borderRadius: '12px',
                            px: 1,
                            height: '40px',
                            border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: isActive ? '#4F46E5' : 'rgba(34, 43, 61, 0.9)',
                            },
                            '& .MuiChip-deleteIcon': {
                                color: isActive ? '#FFFFFF' : '#94A3B8',
                                '&:hover': { color: isActive ? '#E2E8F0' : '#FFFFFF' },
                            },
                            '& .MuiChip-icon': {
                                color: isActive && !tab.activeIcon ? '#FFFFFF' : '#FCD34D',
                            }
                        }}
                    />
                );
            })}
        </Box>
    );
}
