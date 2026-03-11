import React from 'react';

const VideoTile = ({ videoObj, isLocal, videoEnabled, isPinned, onPin, isScreenShare }) => {
    // For local video: use the videoEnabled prop passed from parent
    // For remote video: check the stream's track state
    let hasActiveVideo = false;
    
    if (isLocal) {
        // Local video: rely on the parent's video state
        hasActiveVideo = videoEnabled === true;
    } else {
        // Remote video: check the actual stream
        hasActiveVideo = videoObj?.stream && 
            videoObj.stream.getVideoTracks().length > 0 && 
            videoObj.stream.getVideoTracks()[0].enabled;
    }

    const username = videoObj?.username || "Guest";
    const initial = username.charAt(0).toUpperCase();

    // Local camera should be mirrored. Local screen share should NOT be mirrored.
    const shouldMirror = isLocal && !isScreenShare;

    return (
        <div 
            onClick={onPin}
            className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#1C2230] hover:ring-2 hover:ring-purple-500/50 transition-all cursor-pointer ${isPinned ? 'ring-2 ring-purple-500' : 'border border-white/5'}`}
        >
            
            {hasActiveVideo ? (
                <video
                    data-socket={videoObj.socketId}
                    ref={ref => {
                        if (ref && videoObj.stream && ref.srcObject !== videoObj.stream) {
                            ref.srcObject = videoObj.stream;
                        }
                    }}
                    autoPlay
                    muted={isLocal}
                    className={`w-full h-full ${isPinned ? 'object-contain bg-black' : 'object-cover'} ${shouldMirror ? 'scale-x-[-1]' : ''}`}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#131722]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-semibold shadow-lg">
                        {initial}
                    </div>
                </div>
            )}

            {/* Username overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#1C2230] px-3 py-1.5 rounded-lg shadow-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-white text-sm font-medium">
                    {username}{isLocal ? ' (You)' : ''}{isScreenShare && isLocal ? ' (Presenting)' : ''}
                </span>
            </div>
        </div>
    );
};

export default VideoTile;
