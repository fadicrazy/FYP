import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { patientsAPI, consultationsAPI, prescriptionsAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CreatePrescription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialConsultationId = searchParams.get('consultationId') || '';
  const initialPatientId = searchParams.get('patientId') || '';

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ consultationId: initialConsultationId, patientId: initialPatientId, diagnosis: '', instructions: '', notes: '' });
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMedicine = (i, key, val) => {
    const updated = [...medicines];
    updated[i][key] = val;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First update the consultation as completed
      if (form.consultationId) {
        await consultationsAPI.complete(form.consultationId, { diagnosis: form.diagnosis, notes: form.instructions });
      }
      
      // Then create the prescription
      await prescriptionsAPI.create({ ...form, medicines });
      toast.success('Prescription created and consultation completed!');
      navigate('/dashboard');
    } catch (err) { toast.error('Failed to create prescription'); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-500 mb-6">Complete Consultation & Write Prescription</h1>
      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="input-label">Consultation ID</label><input className="input-field bg-gray-100" value={form.consultationId} onChange={e => setForm({...form, consultationId: e.target.value})} placeholder="Paste consultation ID" required readOnly={!!initialConsultationId} /></div>
            <div><label className="input-label">Patient ID</label><input className="input-field bg-gray-100" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} placeholder="Paste patient ID" required readOnly={!!initialPatientId} /></div>
          </div>
          <div><label className="input-label">Diagnosis</label><textarea className="input-field" rows={2} value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} required /></div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="input-label mb-0">Medicines</label>
              <button type="button" onClick={addMedicine} className="btn-ghost text-sm py-1.5 flex items-center gap-1"><FiPlus /> Add</button>
            </div>
            <div className="space-y-3">
              {medicines.map((med, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Medicine #{i + 1}</span>
                    {medicines.length > 1 && <button type="button" onClick={() => removeMedicine(i)} className="text-medical-red hover:text-red-600"><FiTrash2 /></button>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input className="input-field text-sm" placeholder="Name" value={med.name} onChange={e => updateMedicine(i, 'name', e.target.value)} required />
                    <input className="input-field text-sm" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} />
                    <input className="input-field text-sm" placeholder="Frequency (e.g. 2x/day)" value={med.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} />
                    <input className="input-field text-sm" placeholder="Duration (e.g. 7 days)" value={med.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div><label className="input-label">Instructions</label><textarea className="input-field" rows={2} value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} placeholder="General instructions for the patient" /></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button><button type="submit" disabled={loading} className="btn-accent">{loading ? 'Creating...' : 'Create Prescription'}</button></div>
        </form>
      </div>
    </motion.div>
  );
}
