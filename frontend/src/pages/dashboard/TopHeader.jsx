import React from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const TopHeader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Left - Date */}
            <p style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: 500 }}>Monday, Oct 23</p>

            {/* Right - Bell + User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button style={{ position: 'relative', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                    <span style={{
                        position: 'absolute', top: '-2px', right: '-2px',
                        width: '8px', height: '8px', backgroundColor: '#34D399',
                        borderRadius: '50%'
                    }}></span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #374151', paddingLeft: '20px', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, lineHeight: 1.2, margin: 0 }}>Alex Rivers</p>
                        <p style={{ color: '#2CD4CB', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', margin: 0 }}>PREMIUM PLAN</p>
                    </div>
                    <img
                        src="https://ui-avatars.com/api/?name=Alex+Rivers&background=2CD4CB&color=0B1B1B&bold=true&size=36"
                        alt="Alex Rivers"
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(44,212,203,0.3)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
