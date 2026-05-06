import { useState, useEffect } from 'react';
import { patientsAPI, usersAPI, consultationsAPI } from '../../api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RequestConsultation() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ patientId: '', symptoms: '', notes: '' });

  useEffect(() => {
    patientsAPI.getAll().then(r => setPatients(r.data || [])).catch(() => {});
    usersAPI.getAll('doctor').then(r => setDoctors(r.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await consultationsAPI.request(form);
      toast.success('Consultation requested!');
      setForm({ patientId: '', symptoms: '', notes: '' });
    } catch (err) { toast.error('Failed to request'); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-500 mb-6">Request Doctor Consultation</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Patient *</label>
            <select className="input-field" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required>
              <option value="">Select patient...</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.userId?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Symptoms / Reason *</label>
            <textarea className="input-field" rows={4} value={form.symptoms} onChange={e => setForm({...form, symptoms: e.target.value})} placeholder="Describe symptoms..." required />
          </div>
          <div>
            <label className="input-label">Additional Notes</label>
            <textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any extra info for the doctor..." />
          </div>
          <div className="glass-card bg-blue-50/50 border-blue-200">
            <p className="text-sm text-medical-blue font-medium">ℹ️ Available Doctors: {doctors.filter(d => d.isApproved).length}</p>
            <p className="text-xs text-gray-500 mt-1">A doctor will be assigned once they accept the request.</p>
          </div>
          <div className="flex justify-end"><button type="submit" disabled={loading} className="btn-accent">{loading ? 'Submitting...' : 'Request Consultation'}</button></div>
        </form>
      </div>
    </motion.div>
  );
}
