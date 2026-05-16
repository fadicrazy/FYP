import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { consultationsAPI, prescriptionsAPI } from '../api';
import { useVideoCall } from '../hooks/useVideoCall';
import { useChat } from '../hooks/useChat';
import { FiVideo, FiMic, FiPhoneOff, FiMessageSquare, FiSend, FiFileText, FiPlus } from 'react-icons/fi';
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

  // Prescription Modal State
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescLoading, setPrescLoading] = useState(false);
  const [prescForm, setPrescForm] = useState({ diagnosis: '', instructions: '' });
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);

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
      setShowPrescription(true);
    } else {
      navigate('/dashboard');
      toast.success('Consultation ended');
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescLoading(true);
    try {
      await consultationsAPI.complete(id, { diagnosis: prescForm.diagnosis, notes: prescForm.instructions });
      await prescriptionsAPI.create({
        consultationId: id,
        patientId: consultation?.patientId?._id || consultation?.patientId,
        diagnosis: prescForm.diagnosis,
        instructions: prescForm.instructions,
        medicines
      });
      toast.success('Prescription submitted and call ended');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to submit prescription');
    } finally {
      setPrescLoading(false);
    }
  };

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
  const updateMedicine = (i, key, val) => {
    const updated = [...medicines];
    updated[i][key] = val;
    setMedicines(updated);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 relative">
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
          <button onClick={() => navigate('/dashboard')} className="w-16 h-12 rounded-2xl bg-medical-red flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
            <FiPhoneOff className="text-xl" />
          </button>
          {user?.role === 'doctor' && (
            <button onClick={() => setShowPrescription(true)} className="px-6 h-12 rounded-2xl bg-accent-400 flex items-center justify-center gap-2 text-white hover:bg-accent-500 transition-colors font-medium ml-4">
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

      {/* Prescription Modal Overlay */}
      {showPrescription && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-full overflow-y-auto p-8 shadow-2xl relative">
            <button onClick={() => setShowPrescription(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiSend className="rotate-45" /> {/* Use a different icon for close if needed, but here's a placeholder */}
            </button>
            <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center gap-2">
              <FiFileText className="text-accent-400" /> Write Prescription
            </h2>
            
            <form onSubmit={handlePrescriptionSubmit} className="space-y-6">
              <div>
                <label className="input-label">Diagnosis</label>
                <textarea 
                  className="input-field" 
                  rows={2} 
                  required 
                  value={prescForm.diagnosis}
                  onChange={e => setPrescForm({...prescForm, diagnosis: e.target.value})}
                  placeholder="What is the patient suffering from?"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="input-label mb-0">Medicines</label>
                  <button type="button" onClick={addMedicine} className="text-accent-400 hover:text-accent-500 text-sm font-bold flex items-center gap-1">
                    <FiPlus /> Add Medicine
                  </button>
                </div>
                <div className="space-y-3">
                  {medicines.map((med, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl">
                      <input className="input-field text-xs" placeholder="Name" value={med.name} onChange={e => updateMedicine(i, 'name', e.target.value)} required />
                      <input className="input-field text-xs" placeholder="Dosage" value={med.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} />
                      <input className="input-field text-xs" placeholder="Freq" value={med.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} />
                      <input className="input-field text-xs" placeholder="Dur" value={med.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">Additional Instructions</label>
                <textarea 
                  className="input-field" 
                  rows={2} 
                  value={prescForm.instructions}
                  onChange={e => setPrescForm({...prescForm, instructions: e.target.value})}
                  placeholder="Diet, rest, or other advice..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPrescription(false)} className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-100 font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={prescLoading} className="flex-2 px-8 py-3 rounded-2xl bg-accent-400 text-white font-semibold hover:bg-accent-500 transition-colors shadow-lg shadow-accent-400/30 disabled:opacity-50">
                  {prescLoading ? 'Submitting...' : 'Complete & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
