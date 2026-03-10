import React from 'react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const RecentSummaries = () => {
    const summaries = [
        { title: 'Product Backlog Grooming', time: '2h ago', badge: 'AI GENERATED' },
        { title: 'User Interview #12 - David K.', time: 'Yesterday', badge: 'AI GENERATED' },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <AutoFixHighIcon style={{ color: '#A78BFA', fontSize: '20px' }} />
                    Recent Summaries
                </h2>
                <button style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Archive
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {summaries.map((summary, idx) => (
                    <div key={idx} style={{
                        backgroundColor: '#0d1e21', border: '1px solid #1a3335',
                        borderRadius: '14px', padding: '16px'
                    }}>
                        {/* Top Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    backgroundColor: 'rgba(52,211,153,0.15)', color: '#34D399',
                                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px'
                                }}>
                                    {summary.badge}
                                </span>
                                <span style={{ color: '#6B7280', fontSize: '12px' }}>{summary.time}</span>
                            </div>
                            <button style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                                <ContentCopyIcon style={{ fontSize: '16px' }} />
                            </button>
                        </div>

                        {/* Preview area */}
                        <div style={{
                            height: '80px', backgroundColor: '#091517',
                            borderRadius: '10px', marginBottom: '12px',
                            border: '1px solid #1a3335'
                        }}></div>

                        {/* Title */}
                        <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentSummaries;
