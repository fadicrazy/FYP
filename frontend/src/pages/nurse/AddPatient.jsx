import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, patientsAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AddPatient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '123456', phone: '',
    age: '', gender: 'male', address: '', bloodGroup: '',
    medicalHistory: '', allergies: '', emergencyContact: '', emergencyContactName: ''
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First register user
      const { data: authData } = await authAPI.register({
        name: form.name, email: form.email, password: form.password,
        role: 'patient', phone: form.phone,
      });
      // Then create patient profile
      await patientsAPI.create({
        userId: authData.user.id, age: Number(form.age), gender: form.gender,
        address: form.address, bloodGroup: form.bloodGroup,
        medicalHistory: form.medicalHistory ? form.medicalHistory.split(',').map(s => s.trim()) : [],
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : [],
        emergencyContact: form.emergencyContact, emergencyContactName: form.emergencyContactName,
      });
      toast.success('Patient registered successfully!');
      navigate('/dashboard/patients');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add patient');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-500 mb-6">Register New Patient</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="input-label">Full Name *</label><input className="input-field" value={form.name} onChange={set('name')} required /></div>
            <div><label className="input-label">Email *</label><input type="email" className="input-field" value={form.email} onChange={set('email')} required /></div>
            <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={set('phone')} /></div>
            <div><label className="input-label">Age *</label><input type="number" className="input-field" value={form.age} onChange={set('age')} required min="0" max="150" /></div>
            <div>
              <label className="input-label">Gender *</label>
              <select className="input-field" value={form.gender} onChange={set('gender')}>
                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </div>
            <div><label className="input-label">Blood Group</label><input className="input-field" value={form.bloodGroup} onChange={set('bloodGroup')} placeholder="e.g. A+" /></div>
          </div>
          <div><label className="input-label">Address</label><input className="input-field" value={form.address} onChange={set('address')} placeholder="Village, district" /></div>
          <div><label className="input-label">Medical History</label><input className="input-field" value={form.medicalHistory} onChange={set('medicalHistory')} placeholder="Comma-separated: Diabetes, Hypertension" /></div>
          <div><label className="input-label">Allergies</label><input className="input-field" value={form.allergies} onChange={set('allergies')} placeholder="Comma-separated" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="input-label">Emergency Contact Name</label><input className="input-field" value={form.emergencyContactName} onChange={set('emergencyContactName')} /></div>
            <div><label className="input-label">Emergency Contact Phone</label><input className="input-field" value={form.emergencyContact} onChange={set('emergencyContact')} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-accent">{loading ? 'Registering...' : 'Register Patient'}</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
