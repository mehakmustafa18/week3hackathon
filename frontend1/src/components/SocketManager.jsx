import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SocketManager = () => {
  const { user } = useAuth();

  useEffect(() => {
    const socketServer = process.env.REACT_APP_REVIEWS_SOCKET_URL || 'http://localhost:5001';
    const socket = io(socketServer);

    socket.on('connect', () => {
      console.log('Connected to notification server');
      if (user) {
        socket.emit('join', user._id);
      }
    });

    // Broadcast: New review added
    socket.on('new_review', (data) => {
      toast.info(data.message, {
        icon: '📝',
        onClick: () => {
          // In a real app, maybe navigate to the product
          console.log('New review data:', data.review);
        }
      });
    });

    // Direct: New reply to your review
    socket.on('new_reply', (data) => {
      toast.success(data.message, {
        icon: '💬'
      });
    });

    // Direct: Someone liked your review
    socket.on('review_liked', (data) => {
      toast('Someone liked your review! ❤️', {
        icon: '❤️'
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null; // This component doesn't render anything
};

export default SocketManager;
