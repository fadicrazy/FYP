import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultationsAPI } from '../../api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiVideo, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [mineRes, pendRes] = await Promise.all([
        consultationsAPI.getMine(), consultationsAPI.getPending(),
      ]);
      setConsultations(mineRes.data || []);
      setPending(pendRes.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const completed = consultations.filter(c => c.status === 'completed').length;
  const active = consultations.filter(c => c.status === 'active').length;

  const statCards = [
    { icon: FiClock, label: 'Pending Queue', value: pending.length, color: 'text-medical-orange', bg: 'bg-orange-50' },
    { icon: FiVideo, label: 'Active', value: active, color: 'text-medical-blue', bg: 'bg-blue-50' },
    { icon: FiCheckCircle, label: 'Completed', value: completed, color: 'text-accent-500', bg: 'bg-accent-50' },
    { icon: FiUsers, label: 'Total Cases', value: consultations.length, color: 'text-medical-purple', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-500">Doctor Console 🩺</h1>
        <p className="text-gray-500 mt-1">Welcome, Dr. {user?.name}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className={`stat-icon ${s.bg}`}><s.icon className={`text-2xl ${s.color}`} /></div>
            <div><p className="text-2xl font-bold text-primary-500">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="glass-card">
        <h3 className="font-semibold text-primary-500 mb-4">Pending Consultation Requests</h3>
        {pending.length === 0 ? <p className="text-gray-400 text-sm py-4 text-center">No pending requests</p> : (
          <div className="space-y-3">
            {pending.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Patient: {c.patientId?.userId?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400 mt-1">Symptoms: {c.symptoms || 'Not specified'}</p>
                  <p className="text-xs text-gray-400">Requested: {new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={async () => {
                  try { await consultationsAPI.accept(c._id); loadData(); } catch {}
                }} className="btn-accent text-sm py-2 px-4">Accept</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="glass-card">
        <h3 className="font-semibold text-primary-500 mb-4">My Consultations</h3>
        {consultations.length === 0 ? <p className="text-gray-400 text-sm py-4 text-center">No consultations yet</p> : (
          <div className="space-y-3">
            {consultations.slice(0, 8).map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                <div>
                  <p className="font-medium text-sm">{c.patientId?.userId?.name || 'Patient'}</p>
                  <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${c.status === 'completed' ? 'badge-success' : c.status === 'active' ? 'badge-info' : c.status === 'accepted' ? 'badge-warning' : 'badge-pending'}`}>{c.status}</span>
                  {(c.status === 'accepted' || c.status === 'active') && (
                    <button onClick={async () => { 
                      if(c.status === 'accepted') await consultationsAPI.start(c._id); 
                      navigate(`/dashboard/consultation/${c._id}`);
                    }} className="btn-primary text-xs py-1.5 px-3">Join Call</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
