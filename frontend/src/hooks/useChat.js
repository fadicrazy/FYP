import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export function useChat(roomId, user) {
  const socket = useSocket('/chat');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    socket.emit('joinRoom', { roomId, userId: user.id, userName: user.name });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('userJoined', (data) => {
      // Optional: Handle user joined event
    });

    let typingTimeout;
    socket.on('userTyping', (data) => {
      if (data.userName !== user.name) {
        setTypingUser(data.userName);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setTypingUser(null), 3000);
      }
    });

    return () => {
      socket.emit('leaveRoom', { roomId, userName: user.name });
      socket.off('receiveMessage');
      socket.off('userJoined');
      socket.off('userTyping');
    };
  }, [socket, roomId, user]);

  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('sendMessage', { roomId, message, userId: user.id, userName: user.name });
    }
  };

  const sendTyping = () => {
    if (socket) {
      socket.emit('typing', { roomId, userName: user.name });
    }
  };

  return { messages, sendMessage, sendTyping, typingUser };
}
