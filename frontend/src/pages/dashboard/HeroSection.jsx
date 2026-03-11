import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';

const HeroSection = () => {
    return (
        <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: '16px',
            background: 'linear-gradient(180deg, #1C2230 0%, #131722 100%)', border: '1px solid rgba(255, 255, 255, 0.05)',
            minHeight: '260px', display: 'flex'
        }}>
            {/* Left Content */}
            <div style={{
                width: '60%', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 10
            }}>
                <h1 style={{
                    fontSize: '46px', fontWeight: 800, color: 'white',
                    lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.5px'
                }}>
                    Connect{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                    }}>instantly</span>
                    <br />from anywhere.
                </h1>

                <p style={{
                    color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7,
                    marginBottom: '28px', maxWidth: '420px'
                }}>
                    Experience ultra-low latency, AI-enhanced audio, and seamless collaborative tools in one powerful meeting space.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Enter meet link */}
                    <div style={{
                        display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '999px',
                        padding: '0 16px', height: '44px', gap: '8px'
                    }}>
                        <LinkIcon fontSize="small" style={{ color: '#6B7280' }} />
                        <input
                            type="text"
                            placeholder="Enter meet code"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            style={{
                                background: 'transparent', outline: 'none', border: 'none',
                                fontSize: '14px', color: 'white', width: '90px'
                            }}
                        />
                    </div>

                    {/* Join Call */}
                    <button 
                        onClick={() => meetingCode && navigate(`/${meetingCode}`)}
                        style={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: '#FFFFFF', fontWeight: 700,
                        padding: '0 24px', height: '44px', borderRadius: '999px',
                        fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)'
                    }}>
                        Join Call
                    </button>

                    {/* New Meeting */}
                    <button 
                        onClick={() => navigate(`/${Math.random().toString(36).substring(2, 9)}`)}
                        style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white', fontWeight: 600, padding: '0 20px',
                        height: '44px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer'
                    }}>
                        <AddIcon fontSize="small" />
                        New Meeting
                    </button>
                </div>
            </div>

            {/* Right Image */}
            <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0,
                width: '45%', zIndex: 0
            }}>
                <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                    alt="Team meeting"
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        borderRadius: '0 16px 16px 0', opacity: 0.6,
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                        maskImage: 'linear-gradient(to right, transparent 0%, black 40%)'
                    }}
                />
            </div>
        </div>
    );
};

export default HeroSection;
