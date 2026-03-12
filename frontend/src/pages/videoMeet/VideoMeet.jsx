import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, CircularProgress } from '@mui/material';
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
        console.log("HELLO")
        let localUsername = localStorage.getItem('username') || localStorage.getItem('name') || ('User_' + Math.floor(Math.random() * 1000));
        setUsername(localUsername);
        getPermissions(); // get audio and video permission to user

        // Cleanup on unmount (handles React StrictMode double-mount)
        return () => {
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

    const getPermissions = async () => {
        let vAvailable = true;
        let aAvailable = true;
        setIsConnecting(true); // show loader
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
                videoPermission.getTracks().forEach(t => t.stop()); // Stop permission-check stream
            } else {
                setVideoAvailable(false);
                vAvailable = false;
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
                audioPermission.getTracks().forEach(t => t.stop()); // Stop permission-check stream
            } else {
                setAudioAvailable(false);
                aAvailable = false;
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (vAvailable || aAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: vAvailable, audio: aAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    setLocalStream(userMediaStream);
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
            vAvailable = false;
            aAvailable = false;
        } finally {
            setVideo(vAvailable);
            setAudio(aAvailable);
            connectToSocketServer();
            setIsConnecting(false); // hide loader
            didInitialSetup.current = true; // Mark initial setup done
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
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            console.log('[Socket] Connected with id:', socketRef.current.id);
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id
        })

        socketRef.current.on('chat-message', addMessage)  // listener for chat message

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

            {isConnecting ? (
                <div className="flex flex-col items-center justify-center h-screen bg-[#040F0F] text-white">
                    <CircularProgress sx={{ color: '#818CF8', mb: 3 }} size={48} />
                    <h2 className="text-xl font-medium mb-3">Getting ready...</h2>
                    <p className="text-gray-500">You'll be able to join in just a moment</p>
                </div>
            ) : (

                <div className="relative w-screen h-screen bg-[#040F0F] overflow-hidden flex flex-col">

                    {/* Hidden video element to keep localVideoref pipeline alive */}
                    <video ref={localVideoref} autoPlay muted className="hidden" />

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
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                        handleScreen={handleScreen}
                        handleEndCall={handleEndCall}
                        setModal={setModal}
                    />

                    {/* Main Content Area: Video Grid + Chat Side by Side */}
                    <div className="flex-1 flex overflow-hidden transition-all duration-500 ease-in-out">

                        {/* Video Area */}
                        <div className="flex-1 relative p-4 pb-24 transition-all duration-500 ease-in-out flex gap-4">
                            
                            {pinnedTile ? (
                                // --- PINNED LAYOUT (Main Area + Sidebar) ---
                                <>
                                    {/* Main Pinned Video Area */}
                                    <div className="flex-1 h-full rounded-xl overflow-hidden transition-all duration-500 ease-in-out bg-black/50 border border-white/10">
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
                                        <div className="w-[280px] h-full overflow-y-auto flex flex-col gap-3 pr-1 hide-scrollbar">
                                            {unpinnedTiles.map((vid) => (
                                                <div 
                                                    key={vid.socketId} 
                                                    className="w-full h-[180px] shrink-0 rounded-xl overflow-hidden transition-all duration-300 ease-in-out"
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
                                <>
                                    <div
                                        className="w-full h-full gap-3 transition-all duration-500 ease-in-out"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
                                            gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`,
                                        }}
                                    >
                                        {unpinnedTiles.map((vid) => (
                                            <div 
                                                key={vid.socketId} 
                                                className="rounded-xl overflow-hidden transition-all duration-500 ease-in-out"
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

                                    {/* Local floating thumbnail (ONLY shown if not already in grid and others exist) - But wait, local is in the grid now because we appended it to allTiles! So we don't need the floating thumbnail unless we specifically remove local from the grid. For Google Meet vibe, local IS in the grid usually. But keeping floating if you want. Wait, I added local to `allTiles` so it's in the grid anyway! So no need for floating thumbnail anymore! */}
                                </>
                            )}
                        </div>

                        {/* Chat Sidebar - sits as flex panel next to video grid */}
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

        </div>
    )
}
