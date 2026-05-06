import { useState, useEffect } from 'react';
import { patientsAPI, vitalsAPI } from '../../api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RecordVitals() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientId: '', bloodPressure: '', temperature: '', sugarLevel: '',
    pulse: '', oxygenSaturation: '', weight: '', height: '', notes: ''
  });

  useEffect(() => { patientsAPI.getAll().then(r => setPatients(r.data || [])).catch(() => {}); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vitalsAPI.record({
        ...form, temperature: Number(form.temperature), sugarLevel: Number(form.sugarLevel),
        pulse: Number(form.pulse), oxygenSaturation: Number(form.oxygenSaturation),
        weight: Number(form.weight), height: Number(form.height),
      });
      toast.success('Vitals recorded!');
      setForm({ patientId: '', bloodPressure: '', temperature: '', sugarLevel: '', pulse: '', oxygenSaturation: '', weight: '', height: '', notes: '' });
    } catch (err) { toast.error('Failed to record vitals'); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-500 mb-6">Record Patient Vitals</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Select Patient *</label>
            <select className="input-field" value={form.patientId} onChange={set('patientId')} required>
              <option value="">Choose patient...</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.userId?.name} — {p.gender}, {p.age}yrs</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="input-label">Blood Pressure *</label><input className="input-field" value={form.bloodPressure} onChange={set('bloodPressure')} placeholder="120/80" required /></div>
            <div><label className="input-label">Temperature (°F) *</label><input type="number" step="0.1" className="input-field" value={form.temperature} onChange={set('temperature')} placeholder="98.6" required /></div>
            <div><label className="input-label">Sugar Level (mg/dL) *</label><input type="number" className="input-field" value={form.sugarLevel} onChange={set('sugarLevel')} placeholder="100" required /></div>
            <div><label className="input-label">Pulse (BPM) *</label><input type="number" className="input-field" value={form.pulse} onChange={set('pulse')} placeholder="72" required /></div>
            <div><label className="input-label">SpO2 (%)</label><input type="number" className="input-field" value={form.oxygenSaturation} onChange={set('oxygenSaturation')} placeholder="98" /></div>
            <div><label className="input-label">Weight (kg)</label><input type="number" step="0.1" className="input-field" value={form.weight} onChange={set('weight')} placeholder="70" /></div>
          </div>
          <div><label className="input-label">Notes</label><textarea className="input-field" rows={3} value={form.notes} onChange={set('notes')} placeholder="Additional observations..." /></div>
          <div className="flex justify-end"><button type="submit" disabled={loading} className="btn-accent">{loading ? 'Saving...' : 'Save Vitals'}</button></div>
        </form>
      </div>
    </motion.div>
  );
}
