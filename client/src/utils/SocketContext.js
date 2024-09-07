import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
    const newSocket = io('http://localhost:8000', {
        transports: ['websocket'],
        withCredentials: true,
    });
    console.log('Socket connected: ', newSocket.id); 
    setSocket(newSocket);

    return () => newSocket.close();
}, [setSocket]);



    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
