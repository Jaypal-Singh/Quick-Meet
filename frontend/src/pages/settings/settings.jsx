import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import { Switch } from '@mui/material';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('Profile');
    const tabs = ['Profile', 'Account', 'Notifications', 'Meetings'];

    return (
        <div style={{ color: 'white', maxWidth: '900px', width: '100%', paddingBottom: '40px' }}>
            {/* Header */}
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Settings</h1>
            <p style={{ color: '#9CA3AF', fontSize: '15px', margin: '0 0 40px 0' }}>Manage your account, preferences, and meeting experience.</p>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '32px' }}>
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0 24px 16px 24px',
                            cursor: 'pointer',
                            color: activeTab === tab ? 'white' : '#9CA3AF',
                            fontWeight: activeTab === tab ? 600 : 500,
                            position: 'relative',
                            transition: 'color 0.2s',
                        }}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-1px',
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Content blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Profile Information */}
                <div style={{
                    backgroundColor: '#1C2230',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '32px',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 24px 0' }}>Profile Information</h2>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative' }}>
                            <img
                                src="https://ui-avatars.com/api/?name=Alex+Johnson&background=8B5CF6&color=FFFFFF&size=100&bold=true"
                                alt="Profile"
                                style={{
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    objectFit: 'cover', border: '3px solid #131722'
                                }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                borderRadius: '50%', width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: '3px solid #1C2230'
                            }}>
                                <EditIcon style={{ fontSize: '16px', color: 'white' }} />
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div style={{ flex: 1, minWidth: '300px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Alex Johnson"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        backgroundColor: '#131722', border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px', padding: '14px 16px', color: 'white',
                                        fontSize: '14px', outline: 'none', transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="alex.johnson@meetnext.io"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        backgroundColor: '#131722', border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px', padding: '14px 16px', color: 'white',
                                        fontSize: '14px', outline: 'none', transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account & Security */}
                <div style={{
                    backgroundColor: '#1C2230',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '32px',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 24px 0' }}>Account & Security</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Subscription Plan */}
                        <div style={{
                            backgroundColor: '#131722', border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    backgroundColor: 'rgba(139, 92, 246, 0.1)', width: '40px', height: '40px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <StarIcon style={{ color: '#8B5CF6', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'white' }}>Subscription Plan</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>MeetNext Pro — $15/month</p>
                                </div>
                            </div>
                            <button style={{
                                background: 'transparent', border: 'none', color: '#8B5CF6',
                                fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: 0
                            }}>
                                Manage Plan
                            </button>
                        </div>

                        {/* Password */}
                        <div style={{
                            backgroundColor: '#131722', border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)', width: '40px', height: '40px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <LockIcon style={{ color: '#9CA3AF', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'white' }}>Password</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Last changed 3 months ago</p>
                                </div>
                            </div>
                            <button style={{
                                background: 'transparent', border: 'none', color: '#8B5CF6',
                                fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: 0
                            }}>
                                Update
                            </button>
                        </div>

                    </div>
                </div>

                {/* Notifications */}
                <div style={{
                    backgroundColor: '#1C2230',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '32px',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 24px 0' }}>Notifications</h2>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'white' }}>Email Notifications</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Get summaries of missed meetings and chats</p>
                        </div>
                        <Switch
                            defaultChecked
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B5CF6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B5CF6' }
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
