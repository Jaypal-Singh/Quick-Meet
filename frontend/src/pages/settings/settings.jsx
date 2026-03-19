import React, { useState } from 'react';
import UserProfileView from './components/UserProfileView';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import { Switch, Avatar, Box, Typography } from '@mui/material';

export default function Settings() {
    const [showFullProfile, setShowFullProfile] = useState(false);
    
    const name = localStorage.getItem('name') || 'User';
    const email = localStorage.getItem('email') || '';
    const profilePic = localStorage.getItem('profile_picture') || null;

    if (showFullProfile) {
        return <UserProfileView onBack={() => setShowFullProfile(false)} />;
    }

    return (
        <div style={{ color: 'white', maxWidth: '900px', width: '100%', paddingBottom: '40px' }}>
            {/* Header */}
            <h1 style={{ 
                fontSize: window.innerWidth < 600 ? '28px' : '36px', 
                fontWeight: 800, 
                margin: '0 0 8px 0', 
                letterSpacing: '-0.5px' 
            }}>Settings</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '0 0 32px 0' }}>Manage your account, preferences, and meeting experience.</p>


            {/* Content blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Compact Profile Header */}
                <div style={{
                    backgroundColor: '#1C2230',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <Avatar 
                        src={profilePic || undefined}
                        sx={{ 
                            width: 64, 
                            height: 64, 
                            bgcolor: '#8B5CF6',
                            fontSize: '24px',
                            fontWeight: 700,
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        {!profilePic && name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: 'white', mb: 0.5 }}>
                            {name}
                        </Typography>
                        <Typography 
                            onClick={() => setShowFullProfile(true)}
                            sx={{ 
                                fontSize: '12px', 
                                fontWeight: 700, 
                                color: '#6366F1', 
                                cursor: 'pointer',
                                letterSpacing: '0.5px',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            VIEW PROFILE
                        </Typography>
                    </Box>
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
                                    <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>Premium Plan — Active</p>
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
