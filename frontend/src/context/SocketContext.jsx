import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axiosInstance';

const SocketContext = createContext();

const server_url = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }) => {
    const socket = useRef();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // Re-sync username from strict auth to fix any stale localStorage bugs
            axiosInstance.get('/api/v1/users/check_auth').then(res => {
                const correctUsername = res.data.user.username;
                localStorage.setItem('username', correctUsername);
                
                socket.current = io(server_url);

                socket.current.on('connect', () => {
                    console.log('Global socket connected:', socket.current.id);
                    socket.current.emit('join-personal-room', correctUsername);
                });

                socket.current.on('meeting-update', (data) => {
                    console.log('Meeting update received:', data);
                    window.dispatchEvent(new CustomEvent('refreshMeetings', { detail: data }));
                });

                socket.current.on('disconnect', () => {
                    console.log('Global socket disconnected');
                });
            }).catch(e => console.error("Could not sync username for socket"));
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
