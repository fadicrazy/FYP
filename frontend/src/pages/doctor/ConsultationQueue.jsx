import { useState, useEffect } from 'react';
import { consultationsAPI } from '../../api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ConsultationQueue() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => consultationsAPI.getPending().then(r => { setPending(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const accept = async (id) => {
    try { await consultationsAPI.accept(id); toast.success('Accepted!'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-primary-500 mb-6">Consultation Queue</h1>
      {loading ? <p className="text-gray-400">Loading...</p> :
      pending.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-gray-500">No pending consultations. All caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card flex items-start justify-between">
              <div>
                <p className="font-semibold">{c.patientId?.userId?.name || 'Unknown Patient'}</p>
                <p className="text-sm text-gray-500 mt-1"><strong>Symptoms:</strong> {c.symptoms || 'Not described'}</p>
                <p className="text-xs text-gray-400 mt-1">Nurse: {c.nurseId?.name || 'N/A'} · {new Date(c.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => accept(c._id)} className="btn-accent text-sm">Accept Case</button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
