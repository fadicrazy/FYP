import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { consultationsAPI } from '../api';
import { useVideoCall } from '../hooks/useVideoCall';
import { useChat } from '../hooks/useChat';
import { FiVideo, FiMic, FiPhoneOff, FiMessageSquare, FiSend, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VideoRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [message, setMessage] = useState('');

  // Hooks for real-time
  const { myVideoRef, remoteStreams } = useVideoCall(id, user);
  const { messages, sendMessage } = useChat(id, user);

  useEffect(() => {
    consultationsAPI.getById(id).then(r => setConsultation(r.data)).catch(console.error);
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleEndCall = () => {
    if (user.role === 'doctor') {
      navigate(`/dashboard/prescriptions?consultationId=${id}&patientId=${consultation?.patientId?._id || consultation?.patientId}`);
    } else {
      navigate('/dashboard');
      toast.success('Consultation ended');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Video Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-black rounded-2xl overflow-hidden relative shadow-xl">
          {/* Main Remote Video */}
          {Object.values(remoteStreams).length > 0 ? (
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              ref={(ref) => { if (ref) ref.srcObject = Object.values(remoteStreams)[0]; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 flex-col gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <FiVideo className="text-2xl" />
              </div>
              <p>Waiting for other participant to join...</p>
            </div>
          )}

          {/* Picture in Picture (Local Video) */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <video ref={myVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Controls */}
        <div className="h-20 glass rounded-2xl flex items-center justify-center gap-6">
          <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
            <FiMic className="text-xl" />
          </button>
          <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
            <FiVideo className="text-xl" />
          </button>
          <button onClick={handleEndCall} className="w-16 h-12 rounded-2xl bg-medical-red flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
            <FiPhoneOff className="text-xl" />
          </button>
          {user?.role === 'doctor' && (
            <button onClick={handleEndCall} className="px-6 h-12 rounded-2xl bg-accent-400 flex items-center justify-center gap-2 text-white hover:bg-accent-500 transition-colors font-medium ml-4">
              <FiFileText /> Write Prescription
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-96 glass rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white/50">
          <h3 className="font-semibold text-primary-500 flex items-center gap-2">
            <FiMessageSquare /> Consultation Chat
          </h3>
          <p className="text-xs text-gray-500 mt-1">Patient: {consultation?.patientId?.userId?.name || 'Loading...'}</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col max-w-[80%] ${m.userId === user.id ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <span className="text-[10px] text-gray-400 mb-1 px-1">{m.userName}</span>
              <div className={`p-3 rounded-2xl text-sm ${m.userId === user.id ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                {m.message}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white/50 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent-400 outline-none"
          />
          <button type="submit" disabled={!message.trim()} className="w-10 h-10 rounded-xl bg-accent-400 text-white flex items-center justify-center disabled:opacity-50">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
}
