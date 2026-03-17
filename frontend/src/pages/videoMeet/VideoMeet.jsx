import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MeetingReadyPopup from '../../components/meetingReadyPopup/MeetingReadyPopup';
import server from '../../environment';
import VideoControls from './components/VideoControls';
import VideoTile from './components/VideoTile';
import ChatSidebar from './components/ChatSidebar';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    const location = useLocation();
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();
    let didInitialSetup = useRef(false);

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(false);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [captions, setCaptions] = useState(false);
    let [activeCaptions, setActiveCaptions] = useState({}); // { socketId: { text: "...", timestamp: Date.now() } }
    let recognitionRef = useRef(null);

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(false);
    let [isConnecting, setIsConnecting] = useState(true);
    let [showMeetingReady, setShowMeetingReady] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])
    let [localStream, setLocalStream] = useState(null);
    let [pinnedSocketId, setPinnedSocketId] = useState(null);

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => { // phase 1.1
        console.log("QuickMeet Video Component Mounted");
        
        // Safety timeout to ensure loader disappears even if something hangs
        const timeout = setTimeout(() => {
            setIsConnecting(prev => {
                if (prev) {
                    console.warn('[Safety] Forcing loader off after 10s timeout');
                    return false;
                }
                return prev;
            });
        }, 10000);

        let localUsername = localStorage.getItem('username') || localStorage.getItem('name') || ('User_' + Math.floor(Math.random() * 1000));
        setUsername(localUsername);
        getPermissions(); 

        if (location.state?.inviteSent) {
            setNotification({ open: true, message: "Meeting invite sent successfully!", severity: "success" });
        } else if (location.state?.error) {
            setNotification({ open: true, message: location.state.error, severity: "error" });
        }

        return () => {
            clearTimeout(timeout);
            // Disconnect socket
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            // Close all peer connections
            for (let id in connections) {
                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }
            }
            // Stop local stream tracks
            try {
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => track.stop());
                }
            } catch (e) { }
        };
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const [globalError, setGlobalError] = useState(null);
    const isInitializing = useRef(false);

    const getPermissions = async () => {
        if (isInitializing.current || didInitialSetup.current) {
            console.log('[Init] Skipping: isInitializing=', isInitializing.current, 'didInitialSetup=', didInitialSetup.current);
            return;
        }

        isInitializing.current = true;
        setGlobalError(null);
        setIsConnecting(true);
        console.log('[Init] getPermissions started');

        setScreenAvailable(!!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia));
        
        try {
            // 1. Identify what hardware is actually present
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideo = devices.some(d => d.kind === 'videoinput');
            const hasAudio = devices.some(d => d.kind === 'audioinput');
            console.log('[Init] Hardware detected:', { hasVideo, hasAudio });

            if (!hasVideo && !hasAudio) {
                throw new Error("No camera or microphone found on this device.");
            }

            // 2. Perform ONE unified request for whatever is available
            // This is the most stable pattern across all modern browsers
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: hasVideo, 
                    audio: hasAudio 
                });
                console.log('[Init] Stream captured successfully');
            } catch (err) {
                console.warn('[Init] Initial capture failed, trying fallback:', err.message);
                // Fallback: try video only if audio failed, or vice versa
                if (hasVideo && hasAudio) {
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                        console.log('[Init] Fallback: Video only success');
                    } catch (err2) {
                        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                        console.log('[Init] Fallback: Audio only success');
                    }
                } else {
                    throw err;
                }
            }

            if (stream) {
                window.localStream = stream;
                setLocalStream(stream);
                
                const vTrack = stream.getVideoTracks()[0];
                const aTrack = stream.getAudioTracks()[0];
                
                setVideo(!!vTrack);
                setAudio(!!aTrack);
                setVideoAvailable(!!vTrack);
                setAudioAvailable(!!aTrack);

                if (localVideoref.current) {
                    localVideoref.current.srcObject = stream;
                }
            }

            connectToSocketServer();
        } catch (error) {
            console.error('[Init] Fatal error:', error);
            setGlobalError(error.message || "Failed to access camera/microphone.");
        } finally {
            setIsConnecting(false);
            didInitialSetup.current = true;
            isInitializing.current = false;
        }
    };

    useEffect(() => {
        // Skip the first call - getPermissions already set up the stream
        if (!didInitialSetup.current) return;
        
        // Instead of restarting the camera (which drops the WebRTC connection), 
        // cleanly toggle the track's enabled state.
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => {
                track.enabled = video;
            });
            window.localStream.getAudioTracks().forEach(track => {
                track.enabled = audio;
            });
        }
    }, [video, audio])
    let getMedia = () => { // phase 2.2 
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer(); // phase 3.1  to communicate with server

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        setLocalStream(stream);
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // Replace tracks on existing senders instead of addStream
            let senders = connections[id].getSenders();
            let videoTrack = stream.getVideoTracks()[0];
            let audioTrack = stream.getAudioTracks()[0];
            
            senders.forEach(sender => {
                if (sender.track && videoTrack && sender.track.kind === 'video') {
                    sender.replaceTrack(videoTrack);
                } else if (sender.track && audioTrack && sender.track.kind === 'audio') {
                    sender.replaceTrack(audioTrack);
                }
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            setLocalStream(window.localStream);
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        setLocalStream(stream);
        localVideoref.current.srcObject = stream
        setPinnedSocketId('local'); // Auto-pin when screen sharing

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // Replace tracks on existing senders instead of addStream
            let senders = connections[id].getSenders();
            let videoTrack = stream.getVideoTracks()[0];
            let audioTrack = stream.getAudioTracks()[0];
            
            senders.forEach(sender => {
                if (sender.track && videoTrack && sender.track.kind === 'video') {
                    sender.replaceTrack(videoTrack);
                } else if (sender.track && audioTrack && sender.track.kind === 'audio') {
                    sender.replaceTrack(audioTrack);
                }
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)
            setPinnedSocketId(null); // Unpin when screen sharing ends

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            setLocalStream(window.localStream);
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => { //Phase 4: Signal Exchange (Handshake)
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => { // phase 3.1
        if (socketRef.current && socketRef.current.connected) {
            console.log('[Socket] Already connected, skipping initialization');
            return;
        }

        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            console.log('[Socket] Connected with id:', socketRef.current.id);
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id
        })

        socketRef.current.on('chat-message', addMessage)  // listener for chat message

        socketRef.current.on('caption-message', (data, senderName, senderSocketId) => {
            setActiveCaptions(prev => ({
                ...prev,
                [senderSocketId]: { text: data, name: senderName, timestamp: Date.now() }
            }));
        })

        socketRef.current.on('user-left', (id) => {
            setVideos((videos) => videos.filter((video) => video.socketId !== id))
            if(connections[id]){
                connections[id].close();
                delete connections[id];
            }
        })

        socketRef.current.on('user-joined', (id, clients) => { // tell new user is comming (iam connected to you)

                console.log('[Socket] user-joined event:', id, 'clients:', clients);

                // Play join sound when a DIFFERENT user joins (not self)
                if (id !== socketIdRef.current) {
                    playJoinSound();
                }

                clients.forEach((socketListId) => {
                    // CRITICAL: Don't connect to yourself!
                    if (socketListId === socketIdRef.current) return;

                    // Skip if connection already exists (don't overwrite working connections)
                    if (connections[socketListId]) {
                        console.log('[Socket] Connection already exists for:', socketListId);
                        return;
                    }

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("[WebRTC] onaddstream for:", socketListId);

                        // Atomic update - check and add/update inside setVideos to avoid race conditions
                        setVideos(prevVideos => {
                            let videoExists = prevVideos.find(video => video.socketId === socketListId);
                            if (videoExists) {
                                console.log("FOUND EXISTING - updating stream");
                                const updatedVideos = prevVideos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            } else {
                                console.log("CREATING NEW video tile");
                                let newVideo = {
                                    socketId: socketListId,
                                    stream: event.stream,
                                    autoplay: true,
                                    playsinline: true
                                };
                                const updatedVideos = [...prevVideos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            }
                        });
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        // Stream is already added during connection creation above
                        // Do NOT call addStream again - it creates duplicate streams

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    // Phase 5: Features (Butttons Logic)
    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleCaptions = () => {
        setCaptions(!captions);
    }

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        if (captions && audio) {
            if (!recognitionRef.current) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    const transcript = finalTranscript || interimTranscript;
                    if (transcript.trim() !== '') {
                        setActiveCaptions(prev => ({
                            ...prev,
                            'local': { text: transcript, name: username, timestamp: Date.now() }
                        }));
                        
                        if (socketRef.current) {
                            socketRef.current.emit('caption-message', transcript, username);
                        }
                    }
                };

                recognition.onerror = (event) => {
                    console.error("Speech recognition error", event.error);
                };

                recognition.onend = () => {
                    if (captions && audio && recognitionRef.current) {
                        try {
                            recognitionRef.current.start();
                        } catch(e) {}
                    }
                };

                recognitionRef.current = recognition;
            }

            try {
                recognitionRef.current.start();
            } catch(e) { console.log(e); }
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [captions, audio, username]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setActiveCaptions(prev => {
                let updated = { ...prev };
                let changed = false;
                Object.keys(updated).forEach(id => {
                    if (now - updated[id].timestamp > 4000) { 
                        delete updated[id];
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    //Phase 6: Exit (Call Khatam)
    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/dashboard"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }


    // Helper: compute grid layout (cols x rows) based on participant count
    const getGridLayout = (count) => {
        if (count <= 1) return { cols: 1, rows: 1 };
        if (count === 2) return { cols: 2, rows: 1 };
        if (count <= 4) return { cols: 2, rows: 2 };
        if (count <= 6) return { cols: 3, rows: 2 };
        if (count <= 9) return { cols: 3, rows: 3 };
        return { cols: 4, rows: Math.ceil(count / 4) };
    };

    // Play the join sound
    const playJoinSound = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.4);
        } catch (e) { console.log('Join sound error:', e); }
    };

    // All tiles: remote videos + local (append isLocal flag to local streams)
    const allTiles = videos.length === 0
        ? [{ socketId: 'local', stream: localStream, username: username, isLocal: true }]
        : [...videos, { socketId: 'local', stream: localStream, username: username, isLocal: true }];

    const pinnedTile = allTiles.find(t => t.socketId === pinnedSocketId) || null;
    const unpinnedTiles = pinnedTile ? allTiles.filter(t => t.socketId !== pinnedSocketId) : allTiles;

    const gridLayout = getGridLayout(unpinnedTiles.length);


    return (
        <div>

             {globalError && (
                <div className="flex flex-col items-center justify-center h-screen w-screen bg-red-950 text-white p-10 z-[300]">
                    <h1 className="text-3xl font-bold mb-4">Meeting Error</h1>
                    <p className="bg-black/30 p-4 rounded-lg font-mono text-pink-300 break-all max-w-2xl">{globalError}</p>
                    <button onClick={() => window.location.reload()} className="mt-8 px-6 py-2 bg-white text-black rounded-lg font-bold">Reload Application</button>
                    <p className="mt-4 text-xs text-red-300/50">Check if your camera is being used by another app</p>
                </div>
            )}

            {isConnecting ? (
                <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#0B0F19] text-white z-[200]">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold mb-2">Join Meeting</h2>
                    <p className="text-indigo-300 animate-pulse">Requesting camera and audio access...</p>
                </div>
            ) : (

                <div className="relative w-screen h-screen bg-[#0B0F19] overflow-hidden flex flex-col">

                    {/* Hidden video element to keep localVideoref pipeline alive */}
                    <video ref={localVideoref} autoPlay playsInline muted className="hidden" />

                    {/* Meeting Ready Popup */}
                    {showMeetingReady && videos.length === 0 && (
                        <MeetingReadyPopup 
                            meetingUrl={window.location.href}
                            username={username}
                            onClose={() => setShowMeetingReady(false)}
                        />
                    )}

                    {/* Bottom Controls Component */}
                    <VideoControls 
                        video={video}
                        audio={audio}
                        screen={screen}
                        screenAvailable={screenAvailable}
                        newMessages={newMessages}
                        showModal={showModal}
                        captions={captions}
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                        handleScreen={handleScreen}
                        handleEndCall={handleEndCall}
                        setModal={setModal}
                        handleCaptions={handleCaptions}
                    />

                    {/* Main Content Area: Video Grid + Chat Side by Side */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* Video Area */}
                        <div className={`flex-1 relative p-4 pb-24 transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] flex gap-4 ${
                            showModal ? 'pr-[360px]' : 'pr-0'
                        }`}>
                            
                            {pinnedTile ? (
                                // --- PINNED LAYOUT (Main Area + Sidebar) ---
                                <>
                                    {/* Main Pinned Video Area */}
                                    <div className="flex-1 h-full rounded-2xl overflow-hidden transition-all duration-500 ease-in-out bg-[#131722] border border-white/5 shadow-2xl">
                                        <VideoTile 
                                            videoObj={pinnedTile} 
                                            isLocal={pinnedTile.isLocal || false}
                                            videoEnabled={pinnedTile.isLocal ? video : true}
                                            isPinned={true}
                                            isScreenShare={pinnedTile.isLocal && screen}
                                            onPin={() => setPinnedSocketId(null)}
                                        />
                                    </div>

                                    {/* Right vertical sidebar for unpinned videos */}
                                    {unpinnedTiles.length > 0 && (
                                        <div className="w-[240px] h-full overflow-y-auto flex flex-col gap-3 pr-1 hide-scrollbar">
                                            {unpinnedTiles.map((vid) => (
                                                <div 
                                                    key={vid.socketId} 
                                                    className="w-full aspect-video shrink-0 rounded-xl overflow-hidden transition-all duration-300 ease-in-out bg-[#131722] border border-white/5"
                                                >
                                                    <VideoTile 
                                                        videoObj={vid} 
                                                        isLocal={vid.isLocal || false}
                                                        videoEnabled={vid.isLocal ? video : true}
                                                        isPinned={false}
                                                        isScreenShare={vid.isLocal && screen}
                                                        onPin={() => setPinnedSocketId(vid.socketId)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                // --- REGULAR GRID LAYOUT ---
                                <div
                                    className="flex-1 w-full h-full gap-4 transition-all duration-500 ease-in-out"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
                                        gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`,
                                    }}
                                >
                                    {unpinnedTiles.map((vid) => (
                                        <div 
                                            key={vid.socketId} 
                                            className="w-full h-full rounded-2xl overflow-hidden transition-all duration-500 ease-in-out bg-[#131722] border border-white/5 shadow-lg"
                                        >
                                            <VideoTile 
                                                videoObj={vid} 
                                                isLocal={vid.isLocal || false}
                                                videoEnabled={vid.isLocal ? video : true}
                                                isPinned={false}
                                                isScreenShare={vid.isLocal && screen}
                                                onPin={() => setPinnedSocketId(vid.socketId)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Captions Overlay */}
                            {captions && Object.keys(activeCaptions).length > 0 && (
                                <div className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 pointer-events-none z-40 px-4">
                                    {Object.values(activeCaptions).map((cap, idx) => (
                                        <div key={idx} className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg max-w-2xl text-center border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <span className="font-bold text-indigo-300 text-sm mr-2">{cap.name}:</span>
                                            <span className="text-lg">{cap.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Chat Sidebar - fixed on the right with slide animation */}
                        <ChatSidebar 
                            showModal={showModal}
                            setModal={setModal}
                            messages={messages}
                            message={message}
                            setMessage={setMessage}
                            sendMessage={sendMessage}
                        />
                    </div>
                </div>
            )}

            {/* Notification Snackbar */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={4000} 
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                    sx={{ borderRadius: '12px', bgcolor: notification.severity === 'success' ? '#10B981' : (notification.severity === 'info' ? '#6366F1' : '#EF4444'), color: 'white' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

        </div>
    )
}
