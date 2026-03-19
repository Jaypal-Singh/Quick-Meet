import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const server_url = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }) => {
    const socket = useRef();

    useEffect(() => {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        if (token && username) {
            socket.current = io(server_url);

            socket.current.on('connect', () => {
                console.log('Global socket connected:', socket.current.id);
                socket.current.emit('join-personal-room', username);
            });

            socket.current.on('meeting-update', (data) => {
                console.log('Meeting update received:', data);
                // Dispatch a custom event to notify components to refresh
                window.dispatchEvent(new CustomEvent('refreshMeetings', { detail: data }));
            });

            socket.current.on('disconnect', () => {
                console.log('Global socket disconnected');
            });
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
