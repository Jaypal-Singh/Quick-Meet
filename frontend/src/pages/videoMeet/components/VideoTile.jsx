import React from 'react';

const VideoTile = ({ videoObj, isLocal, videoEnabled, isPinned, onPin, isScreenShare }) => {
    let hasActiveVideo = false;
    
    if (isLocal) {
        // Local: Trust the button state primarily
        hasActiveVideo = videoEnabled === true;
    } else {
        // Remote: If signal is explicitly OFF, show avatar.
        // Otherwise, if we have a stream, try to show video.
        if (videoEnabled === false) {
            hasActiveVideo = false;
        } else {
            hasActiveVideo = !!videoObj?.stream && videoObj.stream.getVideoTracks().length > 0;
        }
    }
    
    // Final safety: if no stream at all, can't show video
    if (hasActiveVideo && (!videoObj?.stream || videoObj.stream.getVideoTracks().length === 0)) {
        hasActiveVideo = false;
    }

    const username = videoObj?.username || "Guest";
    const initial = username.charAt(0).toUpperCase();

    // Local camera should be mirrored. Local screen share should NOT be mirrored.
    const shouldMirror = isLocal && !isScreenShare;

    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (videoRef.current && videoObj?.stream) {
            if (videoRef.current.srcObject !== videoObj.stream) {
                videoRef.current.srcObject = videoObj.stream;
                console.log(`[VideoTile] Assigned stream to video: socket=${videoObj.socketId}`);
                
                // Safety play call: ensure it starts playing even if autoPlay was throttled
                videoRef.current.play().catch(e => {
                    console.warn(`[VideoTile] Play failed:`, e);
                });
            }
        }
    }, [videoObj?.stream, videoObj?.socketId, hasActiveVideo]);

    return (
        <div 
            onClick={onPin}
            className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#1C2230] hover:ring-2 hover:ring-purple-500/50 transition-all cursor-pointer ${isPinned ? 'ring-2 ring-purple-500' : ''}`}
        >
            
            {hasActiveVideo ? (
                <video
                    data-socket={videoObj.socketId}
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className={`w-full h-full ${isPinned ? 'object-contain bg-black' : 'object-cover'} ${shouldMirror ? 'scale-x-[-1]' : ''}`}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#131722]">
                    <div className="w-24 h-24 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-4xl font-semibold shadow-lg">
                        {initial}
                    </div>
                </div>
            )}

            {/* Username overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#1C2230] px-3 py-1.5 rounded-lg border border-white/5 shadow-md">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-white text-xs font-medium tracking-wide">
                    {username}{isLocal ? ' (You)' : ''}{isScreenShare && isLocal ? ' (Presenting)' : ''}
                </span>
            </div>
        </div>
    );
};

export default VideoTile;
