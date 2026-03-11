import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const TopHeader = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 1 }}>
            {/* Left - Date */}
            <Typography sx={{ color: '#9CA3AF', fontSize: { xs: '12px', md: '14px' }, fontWeight: 500, whiteSpace: 'nowrap' }}>
                Monday, Oct 23
            </Typography>

            {/* Right - Bell + User */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2.5 } }}>
                <IconButton sx={{ position: 'relative', color: '#9CA3AF', p: { xs: 0.5, sm: 1 } }}>
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                    <Box component="span" sx={{
                        position: 'absolute', top: { xs: '4px', sm: '6px' }, right: { xs: '4px', sm: '6px' },
                        width: '8px', height: '8px', backgroundColor: '#8B5CF6',
                        borderRadius: '50%'
                    }} />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, borderLeft: '1px solid #374151', pl: { xs: 1.5, sm: 2.5 }, cursor: 'pointer' }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: 'white', fontSize: { xs: '12px', md: '14px' }, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>Alex Rivers</Typography>
                        <Typography sx={{ color: '#8B5CF6', fontSize: { xs: '9px', md: '10px' }, fontWeight: 700, letterSpacing: '1px', margin: 0 }}>PREMIUM PLAN</Typography>
                    </Box>
                    <Box
                        component="img"
                        src="https://ui-avatars.com/api/?name=Alex+Rivers&background=8B5CF6&color=FFFFFF&bold=true&size=36"
                        alt="Alex Rivers"
                        sx={{ width: { xs: '32px', sm: '36px' }, height: { xs: '32px', sm: '36px' }, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(139, 92, 246, 0.3)' }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TopHeader;
