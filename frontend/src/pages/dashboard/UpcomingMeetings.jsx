import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const UpcomingMeetings = () => {
    const meetings = [
        { month: 'OCT', day: '23', title: 'Design System Review', time: '10:30 AM - 11:15 AM', attendees: 5 },
        { month: 'OCT', day: '23', title: 'Quarterly Marketing Sync', time: '02:00 PM - 03:30 PM', attendees: 12 },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <CalendarMonthIcon style={{ color: '#6366F1', fontSize: '20px' }} />
                    Upcoming Meetings
                </h2>
                <button style={{ color: '#8B5CF6', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    View Schedule
                </button>
            </div>

            {/* Meeting Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meetings.map((meeting, idx) => (
                    <div key={idx} style={{
                        display: 'flex', alignItems: 'center', backgroundColor: '#1C2230',
                        border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', padding: '16px'
                    }}>
                        {/* Date Badge */}
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', marginRight: '16px', flexShrink: 0
                        }}>
                            <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{meeting.month}</span>
                            <span style={{ fontSize: '22px', color: 'white', fontWeight: 700, lineHeight: 1 }}>{meeting.day}</span>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: 0 }}>{meeting.title}</p>
                            <p style={{ color: '#9CA3AF', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 0 0' }}>
                                <AccessTimeIcon style={{ fontSize: '14px' }} />
                                {meeting.time}
                            </p>
                        </div>

                        {/* Avatars */}
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                            {[...Array(Math.min(meeting.attendees, 3))].map((_, i) => (
                                <img
                                    key={i}
                                    src={`https://ui-avatars.com/api/?name=U${i + 1}&background=${['8B5CF6', '6366F1', '4F46E5'][i]}&color=fff&size=28&bold=true`}
                                    alt=""
                                    style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        border: '2px solid #1C2230', marginLeft: i > 0 ? '-8px' : '0'
                                    }}
                                />
                            ))}
                            {meeting.attendees > 3 && (
                                <span style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '2px solid #1C2230',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', color: '#D1D5DB', fontWeight: 600, marginLeft: '-8px'
                                }}>
                                    +{meeting.attendees - 3}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingMeetings;
