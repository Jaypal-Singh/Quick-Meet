import React, { useState } from 'react';
import { Box, Typography, ButtonGroup, Button, IconButton, Menu, MenuItem } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date()); // Dynamic current date

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // Placeholder events matching the image design
    const dummyEvents = {
        '2023-9-4': [ // Oct 4
            { id: 1, time: '09:00', title: 'Design Sprint', color: 'rgba(249, 115, 22, 0.2)', border: '#F97316', text: '#F97316' },
            { id: 2, time: '11:30', title: 'Stakeholder Review', color: 'rgba(249, 115, 22, 0.2)', border: '#F97316', text: '#F97316' },
            { id: 3, time: '14:00', title: 'QA Sync', color: 'rgba(56, 188, 248, 0.2)', border: '#38BDF8', text: '#38BDF8' }
        ],
        '2023-9-5': [ // Oct 5
            { id: 4, time: '10:00', title: 'Product All Hands', color: 'rgba(249, 115, 22, 0.2)', border: '#F97316', text: '#F97316' }
        ]
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDates = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const todayStr = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;

        const daysInCurrentMonth = getDaysInMonth(year, month);
        const daysInPrevMonth = getDaysInMonth(year, month - 1);
        const startDay = getFirstDayOfMonth(year, month);

        const dates = [];

        // Previous month padding
        for (let i = startDay - 1; i >= 0; i--) {
            dates.push({
                date: daysInPrevMonth - i,
                disabled: true,
            });
        }

        // Current month
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            const dateStr = `${year}-${month}-${i}`;
            const isToday = dateStr === todayStr;
            const hasEvents = dummyEvents[dateStr];

            dates.push({
                date: i,
                disabled: false,
                active: !!hasEvents,
                isToday: isToday,
                events: hasEvents || null
            });
        }

        // Next month padding to fill exactly 35 or 42 cells
        const totalCells = dates.length <= 35 ? 35 : 42;
        const remainingCells = totalCells - dates.length;
        for (let i = 1; i <= remainingCells; i++) {
            dates.push({
                date: i,
                disabled: true,
            });
        }

        return dates;
    };

    const dates = generateCalendarDates();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const [monthAnchorEl, setMonthAnchorEl] = useState(null);
    const [yearAnchorEl, setYearAnchorEl] = useState(null);

    const handleMonthClick = (event) => setMonthAnchorEl(event.currentTarget);
    const handleMonthClose = () => setMonthAnchorEl(null);
    const handleMonthSelect = (monthIndex) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        handleMonthClose();
    };

    const handleYearClick = (event) => setYearAnchorEl(event.currentTarget);
    const handleYearClose = () => setYearAnchorEl(null);
    const handleYearSelect = (year) => {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
        handleYearClose();
    };

    return (
        <Box sx={{ mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Typography
                                variant="h4"
                                onClick={handleMonthClick}
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2.125rem' },
                                    fontWeight: 800,
                                    color: '#F8FAFC',
                                    letterSpacing: '-0.5px',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#8B5CF6' },
                                    transition: 'color 0.2s'
                                }}
                            >
                                {monthNames[currentDate.getMonth()]}
                            </Typography>
                            <Menu
                                anchorEl={monthAnchorEl}
                                open={Boolean(monthAnchorEl)}
                                onClose={handleMonthClose}
                                PaperProps={{
                                    sx: {
                                        bgcolor: '#171C28',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                        mt: 1,
                                        maxHeight: 300,
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'rgba(255, 255, 255, 0.02)',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: 'rgba(148, 163, 184, 0.2)',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            background: 'rgba(148, 163, 184, 0.4)',
                                        },
                                        '& .MuiMenuItem-root': {
                                            color: '#E2E8F0',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' },
                                            '&.Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.25)', color: '#6366F1', fontWeight: 700 },
                                            '&.Mui-selected:hover': { bgcolor: 'rgba(99, 102, 241, 0.35)' }
                                        }
                                    }
                                }}
                            >
                                {monthNames.map((month, index) => (
                                    <MenuItem
                                        key={month}
                                        selected={index === currentDate.getMonth()}
                                        onClick={() => handleMonthSelect(index)}
                                    >
                                        {month}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Typography
                                variant="h4"
                                onClick={handleYearClick}
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2.125rem' },
                                    fontWeight: 800,
                                    color: '#F8FAFC',
                                    letterSpacing: '-0.5px',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#8B5CF6' },
                                    transition: 'color 0.2s'
                                }}
                            >
                                {currentDate.getFullYear()}
                            </Typography>
                            <Menu
                                anchorEl={yearAnchorEl}
                                open={Boolean(yearAnchorEl)}
                                onClose={handleYearClose}
                                PaperProps={{
                                    sx: {
                                        bgcolor: '#171C28',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                        mt: 1,
                                        maxHeight: 300,
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'rgba(255, 255, 255, 0.02)',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: 'rgba(148, 163, 184, 0.2)',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            background: 'rgba(148, 163, 184, 0.4)',
                                        },
                                        '& .MuiMenuItem-root': {
                                            color: '#E2E8F0',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' },
                                            '&.Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.25)', color: '#6366F1', fontWeight: 700 },
                                            '&.Mui-selected:hover': { bgcolor: 'rgba(99, 102, 241, 0.35)' }
                                        }
                                    }
                                }}
                            >
                                {Array.from({ length: 20 }, (_, i) => 2020 + i).map(year => (
                                    <MenuItem
                                        key={year}
                                        selected={year === currentDate.getFullYear()}
                                        onClick={() => handleYearSelect(year)}
                                    >
                                        {year}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            <IconButton size="small" onClick={handlePrevMonth} sx={{ color: '#94A3B8', '&:hover': { color: '#E2E8F0' } }}>
                                <ChevronLeftIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleNextMonth} sx={{ color: '#94A3B8', '&:hover': { color: '#E2E8F0' } }}>
                                <ChevronRightIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#8B5CF6', fontWeight: 600, mt: 0.5 }}>
                        You have 4 meetings today
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: 'rgba(34, 43, 61, 0.6)', p: 0.5, borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', display: { xs: 'none', sm: 'block' } }}>
                    <ButtonGroup variant="text" sx={{ '& .MuiButton-root': { textTransform: 'none', minWidth: { xs: '60px', md: '80px' }, border: 'none !important', fontSize: { xs: '12px', md: '14px' } } }}>
                        <Button sx={{ bgcolor: '#222B3D', color: '#FFFFFF', borderRadius: '8px !important', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:hover': { bgcolor: '#222B3D' } }}>Month</Button>
                        <Button sx={{ color: '#94A3B8', '&:hover': { color: '#E2E8F0', bgcolor: 'transparent' } }}>Week</Button>
                        <Button sx={{ color: '#94A3B8', '&:hover': { color: '#E2E8F0', bgcolor: 'transparent' } }}>Day</Button>
                    </ButtonGroup>
                </Box>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                overflow: 'hidden',
                bgcolor: 'rgba(23, 28, 40, 0.4)',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Days Header */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {daysOfWeek.map((day, i) => (
                        <Box key={day} sx={{ py: 1.5, textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.05)', '&:nth-of-type(7n)': { borderRight: 'none' } }}>
                            <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 700, fontSize: '0.75rem', letterSpacing: 1 }}>
                                {day}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Grid Cells */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: { xs: 'minmax(70px, auto)', sm: 'minmax(100px, auto)' } }}>
                    {dates.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                p: { xs: 0.5, md: 1.5 },
                                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                '&:nth-of-type(7n)': { borderRight: 'none' }, // Remove right border for last column
                                opacity: item.disabled ? 0.3 : 1,
                                bgcolor: item.active ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                border: item.active ? '1px solid #6366F1' : '1px solid transparent',
                                position: 'relative',
                                transition: 'all 0.2s',
                                ...(item.active && { zIndex: 2, borderRadius: '8px' }),
                                '&:hover': !item.disabled && !item.active ? {
                                    bgcolor: 'rgba(255, 255, 255, 0.02)'
                                } : {}
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: item.active ? '#FFFFFF' : item.isToday ? '#6366F1' : '#E2E8F0',
                                        fontWeight: item.active || item.isToday ? 800 : 500,
                                        width: '28px',
                                        height: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        bgcolor: item.isToday ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
                                    }}
                                >
                                    {item.date}
                                </Typography>
                            </Box>

                            {item.events && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {item.events.map(ev => (
                                        <Box
                                            key={ev.id}
                                            sx={{
                                                bgcolor: ev.color,
                                                borderLeft: `2px solid ${ev.border}`,
                                                borderRadius: '4px',
                                                p: 0.75,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.02)', filter: 'brightness(1.1)' }
                                            }}
                                        >
                                            <Typography sx={{ color: ev.text, fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.1 }}>
                                                {ev.time}
                                            </Typography>
                                            <Typography sx={{ color: ev.text, fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.2, mt: 0.2 }}>
                                                {ev.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
