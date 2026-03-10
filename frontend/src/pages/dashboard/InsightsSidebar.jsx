import React from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const InsightsSidebar = () => {
    const activeContacts = [
        { name: 'Sarah Jenkins', status: 'online' },
        { name: 'Marcus Thorne', status: 'online' },
    ];

    return (
        <div style={{
            backgroundColor: '#1C2230', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
            {/* Title */}
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: 0 }}>Attendance & Insights</h3>

            {/* Total Meeting Hours */}
            <div style={{
                backgroundColor: '#131722', border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '14px', padding: '20px'
            }}>
                <p style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 500, margin: '0 0 4px 0' }}>Total Meeting Hours</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ color: 'white', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>18.5</span>
                    <span style={{ color: '#8B5CF6', fontSize: '14px', fontWeight: 700, paddingBottom: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +12%
                    </span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '11px', margin: '4px 0 0 0' }}>v.s. 16.2 hours last week</p>
            </div>

            {/* Average Attendance */}
            <div style={{
                backgroundColor: '#131722', border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '14px', padding: '20px'
            }}>
                <p style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 500, margin: '0 0 4px 0' }}>Average Attendance</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ color: 'white', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>94%</span>
                    <span style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: 500, paddingBottom: '4px' }}>Stable</span>
                </div>
                {/* Progress Bar */}
                <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', width: '94%', borderRadius: '999px',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                    }}></div>
                </div>
            </div>

            {/* Active Contacts */}
            <div>
                <h4 style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>ACTIVE CONTACTS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeContacts.map((contact, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    backgroundColor: contact.status === 'online' ? '#34D399' : '#6B7280'
                                }}></span>
                                <span style={{ color: '#D1D5DB', fontSize: '14px' }}>{contact.name}</span>
                            </div>
                            <button style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                                <ChatBubbleOutlineIcon style={{ fontSize: '16px' }} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InsightsSidebar;
