import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { patientsAPI, consultationsAPI, vitalsAPI } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiActivity, FiVideo, FiPlusCircle, FiClock } from 'react-icons/fi';

export default function NurseDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        patientsAPI.getAll(),
        consultationsAPI.getMine(),
      ]);
      setPatients(pRes.data || []);
      setConsultations(cRes.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const statCards = [
    { icon: FiUsers, label: 'Total Patients', value: patients.length, color: 'text-medical-blue', bg: 'bg-blue-50' },
    { icon: FiVideo, label: 'Consultations', value: consultations.length, color: 'text-accent-500', bg: 'bg-accent-50' },
    { icon: FiClock, label: 'Pending', value: consultations.filter(c => c.status === 'pending').length, color: 'text-medical-orange', bg: 'bg-orange-50' },
    { icon: FiActivity, label: 'Active', value: consultations.filter(c => c.status === 'active').length, color: 'text-medical-purple', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-500">Nurse Station 🏥</h1>
          <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
        </div>
        <Link to="/dashboard/add-patient" className="btn-accent flex items-center gap-2"><FiPlusCircle /> Add Patient</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className={`stat-icon ${s.bg}`}><s.icon className={`text-2xl ${s.color}`} /></div>
            <div><p className="text-2xl font-bold text-primary-500">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold text-primary-500 mb-4">Recent Patients</h3>
          {patients.length === 0 ? <p className="text-gray-400 text-sm py-4 text-center">No patients registered yet</p> : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold text-sm">
                    {p.userId?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.userId?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{p.gender}, {p.age} yrs</p>
                  </div>
                  <span className="badge-info">{p.bloodGroup || 'N/A'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-primary-500 mb-4">Consultation Requests</h3>
          {consultations.length === 0 ? <p className="text-gray-400 text-sm py-4 text-center">No consultations</p> : (
            <div className="space-y-3">
              {consultations.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">#{c._id?.slice(-6)}</p>
                    <p className="text-xs text-gray-400">{c.symptoms?.slice(0, 30) || 'No symptoms'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${c.status === 'completed' ? 'badge-success' : c.status === 'active' ? 'badge-info' : 'badge-pending'}`}>{c.status}</span>
                    {c.status === 'active' && (
                      <button onClick={() => navigate(`/dashboard/consultation/${c._id}`)} className="btn-primary text-xs py-1.5 px-3">Join Call</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
