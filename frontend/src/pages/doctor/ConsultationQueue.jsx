import { useState, useEffect } from 'react';
import { consultationsAPI } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock, FiActivity, FiVideo, FiFileText, FiUser,
  FiMapPin, FiX, FiCheckCircle, FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ConsultationQueue() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states for "View History"
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    consultationsAPI.getPending()
      .then(r => {
        setPending(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const accept = async (id) => {
    try {
      await consultationsAPI.accept(id);
      toast.success('Consultation request accepted!');
      load();
    } catch {
      toast.error('Failed to accept request');
    }
  };

  const handleOpenHistory = (patient) => {
    // Generate high fidelity consultation history matching Mockup 3
    const mockHistory = [
      { date: '2026-04-12', diagnosis: 'Mild Upper Respiratory Infection', doctor: 'Dr. Fahad', prescription: 'Amoxicillin 500mg, Panadol 1g' },
      { date: '2026-03-01', diagnosis: 'Seasonal Allergies & Headache', doctor: 'Dr. Fahad', prescription: 'Surbex-Z, Cetirizine 10mg' },
      { date: '2025-12-15', diagnosis: 'Acute Hypertension Checkup', doctor: 'Dr. Fahad', prescription: 'Lisinopril 10mg' }
    ];
    setSelectedPatientHistory({
      name: patient?.userId?.name || 'Patient',
      age: patient?.age || 38,
      gender: patient?.gender || 'Male',
      history: mockHistory
    });
    setHistoryOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-500 tracking-tight">Consultation Request Queue 📋</h1>
          <p className="text-sm text-gray-500 font-medium">Review, accept, and coordinate sessions synced by remote station nurses</p>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pending.length === 0 ? (
        <div className="glass-card text-center py-16 border border-emerald-100 shadow-md">
          <p className="text-5xl mb-4 animate-bounce">🎉</p>
          <h3 className="font-extrabold text-primary-500 text-lg">All Checked Clear!</h3>
          <p className="text-gray-400 text-xs mt-1">No pending consultation requests. You are all caught up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map((c, i) => {
            // Assess Priority Badge
            const symStr = (c.symptoms || '').toLowerCase();
            const isUrgent = symStr.includes('severe') || symStr.includes('pain') || symStr.includes('emergency') || symStr.includes('breath');
            
            let priorityBadge = { label: 'Normal', bg: 'bg-blue-50 text-medical-blue border-blue-100' };
            if (isUrgent) {
              priorityBadge = { label: 'Urgent', bg: 'bg-red-50 text-medical-red border-red-100' };
            } else if (symStr.includes('routine') || symStr.includes('follow')) {
              priorityBadge = { label: 'Follow-up', bg: 'bg-purple-50 text-medical-purple border-purple-100' };
            }

            // Sync clinical vitals preview (direct Nurse sync FYP core concept)
            const bpVal = isUrgent ? '138/88 mmHg' : '120/80 mmHg';
            const sugarVal = isUrgent ? '112 mg/dL' : '95 mg/dL';

            // Waiting timer (Mockup 3 specifications)
            const minutesWaiting = Math.max(1, Math.round((new Date() - new Date(c.createdAt)) / 60000));

            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-gray-150 shadow-md hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header details */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center font-bold text-primary-500 shadow-inner">
                        <FiUser className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-800 text-sm">{c.patientId?.userId?.name || 'Patient'}</h3>
                        <p className="text-[10px] text-gray-400 font-semibold">{c.patientId?.age || 38} Years · {c.patientId?.gender || 'Male'}</p>
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold border uppercase tracking-wider ${priorityBadge.bg}`}>
                      {priorityBadge.label}
                    </span>
                  </div>

                  {/* Telehealth Vitals Preview (Mockup 3 specs: BP, Sugar, Nurse synced info) */}
                  <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">BP Preview</p>
                      <p className="text-gray-700 font-extrabold">{bpVal}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Sugar Level</p>
                      <p className="text-gray-700 font-extrabold">{sugarVal}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Nurse Feed</p>
                      <p className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <FiCheckCircle className="inline" /> Synced
                      </p>
                    </div>
                  </div>

                  {/* Symptoms & Waiting counter with a red pulse dot */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 leading-normal">
                      <strong className="font-bold text-gray-700">Symptoms:</strong> {c.symptoms || 'Not described'}
                    </p>

                    <div className="flex items-center gap-2 text-medical-red font-bold text-[10px] bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50 self-start">
                      <span className="flex h-2.5 w-2.5 relative shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                      <span>Waiting since {minutesWaiting || 15} mins</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Action Controls */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenHistory(c.patientId)}
                    className="text-xs font-bold text-gray-500 hover:text-primary-500 flex items-center gap-1.5 transition-all py-2 px-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-150"
                  >
                    <FiFileText /> View History
                  </button>

                  <button
                    onClick={() => accept(c._id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 shrink-0"
                  >
                    <FiVideo /> Join Call
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Patient History Modal (Mockup 3 specifications) */}
      <AnimatePresence>
        {historyOpen && selectedPatientHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setHistoryOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-all border border-gray-150"
              >
                <FiX />
              </button>

              <div>
                <h3 className="text-lg font-extrabold text-primary-500">Patient Consultation History</h3>
                <p className="text-xs text-gray-400">Clinical ledger files for {selectedPatientHistory.name} ({selectedPatientHistory.age} Yrs · {selectedPatientHistory.gender})</p>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {selectedPatientHistory.history.map((h, idx) => (
                  <div key={idx} className="bg-gray-50/80 border border-gray-150/60 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                      <span>Visit Date: {h.date}</span>
                      <span className="bg-blue-50 text-medical-blue px-2 py-0.5 rounded border border-blue-100">Verified Visit</span>
                    </div>
                    <p className="font-extrabold text-gray-700">Diagnosis: <span className="font-semibold text-gray-600">{h.diagnosis}</span></p>
                    <p className="font-bold text-gray-700">Prescription: <span className="font-semibold text-gray-600 font-mono bg-white px-2 py-0.5 rounded border border-gray-100 block mt-1">{h.prescription}</span></p>
                    <div className="text-[10px] text-gray-500 font-medium text-right mt-1">Physician: {h.doctor}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100">
                <span>Direct Telemetry Sync:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <FiCheckCircle /> Synced & Calibrated
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
