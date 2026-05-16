import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { useSocket } from './useSocket';

export function useVideoCall(roomId, user) {
  const socket = useSocket('/video');
  const [peer, setPeer] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  
  const myVideoRef = useRef(null);
  
  useEffect(() => {
    if (!socket || !roomId || !user) return;

    // Initialize PeerJS
    const p = new Peer(user.id);
    setPeer(p);

    const streamRef = { current: null };

    // Get Media Stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      streamRef.current = stream;
      setMyStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      // Answer incoming calls
      p.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          setRemoteStreams((prev) => ({ ...prev, [call.peer]: remoteStream }));
        });
      });

      // Tell socket we joined
      socket.emit('joinVideoRoom', { roomId, userId: user.id, userName: user.name });
    });

    // When a new user joins, call them
    socket.on('userJoinedVideo', (data) => {
      if (data.userId !== user.id) {
        // give peerjs a moment to register
        setTimeout(() => {
          if (!streamRef.current) return;
          const call = p.call(data.userId, streamRef.current);
          if (call) {
             call.on('stream', (remoteStream) => {
               setRemoteStreams((prev) => ({ ...prev, [data.userId]: remoteStream }));
             });
          }
        }, 1000);
      }
    });

    socket.on('userDisconnected', (data) => {
       // Cleanup logic if needed
    });

    return () => {
      p.destroy();
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      socket.off('userJoinedVideo');
      socket.off('userDisconnected');
    };
  }, [socket, roomId, user]);

  return { myVideoRef, remoteStreams };
}
