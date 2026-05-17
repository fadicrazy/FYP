import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { patientsAPI, consultationsAPI, prescriptionsAPI, inventoryAPI } from '../../api';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiSearch, FiPackage, FiActivity, FiDollarSign,
  FiFileText, FiUser, FiCalendar, FiArrowLeft, FiFilter, FiCheckCircle
} from 'react-icons/fi';

export default function CreatePrescription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialConsultationId = searchParams.get('consultationId') || '';
  const initialPatientId = searchParams.get('patientId') || '';

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    consultationId: initialConsultationId,
    patientId: initialPatientId,
    diagnosis: '',
    instructions: '',
    notes: ''
  });
  const [medicines, setMedicines] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data } = await inventoryAPI.getAll();
      setAvailableMedicines(data || []);
    } catch (e) {
      console.error('Failed to load inventory:', e);
      toast.error('Failed to query pharmacy inventory');
    }
  };

  // Categories list
  const categories = ['All', 'Analgesics', 'Antibiotics', 'Cardiology', 'Antidiabetic', 'Respiratory', 'Vitamins', 'Gastroenterology'];

  // Add medicine to prescription from inventory list
  const handleAddMedicine = (med) => {
    const currentSelectedCount = medicines.filter(m => m.name === med.name).length;
    const currentStock = med.stock - (currentSelectedCount * 10);

    if (currentStock <= 0) {
      toast.error(`${med.name} is currently out of stock!`);
      return;
    }

    setMedicines([
      ...medicines,
      {
        name: med.name,
        dosage: med.unit === 'Tablet' ? '1 tablet' : '1 capsule',
        frequency: '2x/day',
        duration: '7 days',
        instructions: 'Take after meal'
      }
    ]);
    toast.success(`Added ${med.name} to prescription draft!`);
  };

  const removeMedicine = (index) => {
    const updated = medicines.filter((_, idx) => idx !== index);
    setMedicines(updated);
  };

  const updateMedicine = (index, key, val) => {
    const updated = [...medicines];
    updated[index][key] = val;
    setMedicines(updated);
  };

  // Calculate dynamic stock live on-screen with exact frequency & duration parsing
  const getLiveStock = (med) => {
    let totalDeduction = 0;
    medicines.forEach(m => {
      if (m.name === med.name) {
        let timesPerDay = 2; // Default fallback
        let durationDays = 7; // Default fallback

        // 1. Parse Frequency
        if (m.frequency) {
          const freqStr = m.frequency.toLowerCase();
          const matchTimes = freqStr.match(/(\d+)\s*(x|time)/i);
          if (matchTimes && matchTimes[1]) {
            timesPerDay = parseInt(matchTimes[1], 10);
          } else if (freqStr.includes('once') || freqStr.includes('1x') || freqStr.includes('daily') || freqStr.includes('od')) {
            timesPerDay = 1;
          } else if (freqStr.includes('twice') || freqStr.includes('2x') || freqStr.includes('bid') || freqStr.includes('bd')) {
            timesPerDay = 2;
          } else if (freqStr.includes('thrice') || freqStr.includes('3x') || freqStr.includes('tid') || freqStr.includes('tds')) {
            timesPerDay = 3;
          } else if (freqStr.includes('four') || freqStr.includes('4x') || freqStr.includes('qid')) {
            timesPerDay = 4;
          }
        }

        // 2. Parse Duration
        if (m.duration) {
          const durStr = m.duration.toLowerCase();
          const matchDays = durStr.match(/(\d+)\s*day/i);
          const matchWeeks = durStr.match(/(\d+)\s*week/i);
          const matchMonths = durStr.match(/(\d+)\s*month/i);

          if (matchDays && matchDays[1]) {
            durationDays = parseInt(matchDays[1], 10);
          } else if (matchWeeks && matchWeeks[1]) {
            durationDays = parseInt(matchWeeks[1], 10) * 7;
          } else if (matchMonths && matchMonths[1]) {
            durationDays = parseInt(matchMonths[1], 10) * 30;
          } else if (durStr.includes('week')) {
            durationDays = 7;
          } else if (durStr.includes('month')) {
            durationDays = 30;
          } else {
            const matchRawNum = durStr.match(/(\d+)/);
            if (matchRawNum && matchRawNum[1]) {
              durationDays = parseInt(matchRawNum[1], 10);
            }
          }
        }

        totalDeduction += timesPerDay * durationDays;
      }
    });

    return Math.max(0, med.stock - totalDeduction);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medicines.length === 0) {
      toast.error('Please add at least one medicine to prescribe!');
      return;
    }

    setLoading(true);
    try {
      if (form.consultationId) {
        await consultationsAPI.complete(form.consultationId, {
          diagnosis: form.diagnosis,
          notes: form.instructions
        });
      }
      
      await prescriptionsAPI.create({ ...form, medicines });
      toast.success('Prescription generated & pharmacy inventory updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  // Filter medicines based on search & category tabs
  const filteredMeds = availableMedicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-150 transition-all"
          >
            <FiArrowLeft />
          </button>
          <div>
            <span className="bg-emerald-50 text-emerald-600 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-100">
              Interactive Clinical Workspace
            </span>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-1">
              Create Prescription & Dispense Vitals 💊
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Prescription Form Draft (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 border border-gray-150 shadow-lg bg-white rounded-3xl">
            <h3 className="font-extrabold text-gray-800 text-lg mb-5 flex items-center gap-2">
              <FiFileText className="text-emerald-500" /> Prescription Draft Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Consultation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 font-bold text-[11px] uppercase tracking-wider block mb-1">
                    Consultation ID
                  </label>
                  <div className="relative">
                    <FiActivity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-700 font-mono outline-none"
                      value={form.consultationId}
                      onChange={e => setForm({...form, consultationId: e.target.value})}
                      placeholder="Paste consultation ID"
                      required
                      readOnly={!!initialConsultationId}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 font-bold text-[11px] uppercase tracking-wider block mb-1">
                    Patient ID
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-700 font-mono outline-none"
                      value={form.patientId}
                      onChange={e => setForm({...form, patientId: e.target.value})}
                      placeholder="Paste patient ID"
                      required
                      readOnly={!!initialPatientId}
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis Field */}
              <div>
                <label className="text-gray-600 font-bold text-[11px] uppercase tracking-wider block mb-1">
                  Diagnosis / Clinical Findings
                </label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400"
                  rows={2}
                  value={form.diagnosis}
                  onChange={e => setForm({...form, diagnosis: e.target.value})}
                  placeholder="e.g. Patient presents with high fever, respiratory distress and sore throat."
                  required
                />
              </div>

              {/* Selected Prescription Medicines Draft */}
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <label className="text-gray-700 font-extrabold text-[12px] uppercase tracking-wider block">
                    Prescribed Medicines ({medicines.length})
                  </label>
                  {medicines.length === 0 && (
                    <span className="text-[10px] text-gray-400 font-bold italic animate-pulse">
                      Select medicines from the right panel to draft 👈
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {medicines.map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 bg-gray-50/70 border border-gray-150 rounded-2xl space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5">
                            <FiCheckCircle /> Medicine #{i + 1}: {med.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMedicine(i)}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Dosage</span>
                            <input
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-accent-400"
                              placeholder="e.g. 500mg / 1 tablet"
                              value={med.dosage}
                              onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Frequency</span>
                            <input
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-accent-400"
                              placeholder="e.g. 2x/day / every 8 hrs"
                              value={med.frequency}
                              onChange={e => updateMedicine(i, 'frequency', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Duration</span>
                            <input
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-accent-400"
                              placeholder="e.g. 7 days / 1 month"
                              value={med.duration}
                              onChange={e => updateMedicine(i, 'duration', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Intake Instructions</span>
                          <input
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-accent-400 mt-0.5"
                            placeholder="e.g. Take after meal with warm water"
                            value={med.instructions}
                            onChange={e => updateMedicine(i, 'instructions', e.target.value)}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* General Instructions */}
              <div>
                <label className="text-gray-600 font-bold text-[11px] uppercase tracking-wider block mb-1">
                  General Consultation Instructions / Patient Advice
                </label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400"
                  rows={2}
                  value={form.instructions}
                  onChange={e => setForm({...form, instructions: e.target.value})}
                  placeholder="e.g. Get bed rest, drink warm fluids, and consult back if fever persists."
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-2.5 px-5 rounded-2xl transition-all outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || medicines.length === 0}
                  className={`bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-2.5 px-6 rounded-2xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer ${
                    medicines.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''
                  }`}
                >
                  {loading ? 'Generating...' : 'Finalize & Dispense Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Pharmacy Live Inventory Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 border border-gray-150 shadow-lg bg-white rounded-3xl space-y-4">
            
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                <FiPackage className="text-emerald-500" /> Pharmacy Live Inventory
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                Click + Prescribe to automatically add medicines and deduct stock live
              </p>
            </div>

            {/* Live search input */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all outline-none"
                placeholder="Search stock by name/category..."
              />
            </div>

            {/* Category tabs filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 pr-0.5 custom-scrollbar max-w-full">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 transition-all cursor-pointer ${
                    selectedCategory === c
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-400 border border-gray-150 hover:bg-gray-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Dynamic Medicine Cards grid */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredMeds.length === 0 ? (
                <p className="text-center py-12 text-gray-400 font-bold text-xs italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No medicine matches selected filter
                </p>
              ) : (
                filteredMeds.map((med) => {
                  const liveStock = getLiveStock(med);
                  const isLow = liveStock <= med.minStock && liveStock > 0;
                  const isOut = liveStock <= 0;

                  return (
                    <div
                      key={med._id}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                        isOut
                          ? 'bg-red-50/20 border-red-100 opacity-60'
                          : isLow
                          ? 'bg-amber-50/20 border-amber-100 hover:border-amber-300'
                          : 'bg-white border-gray-150 hover:border-emerald-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-800">{med.name}</h4>
                          <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">
                            {med.category} · {med.manufacturer}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-black text-emerald-600 flex items-center">
                          <FiDollarSign size={10} /> {med.price} PKR
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                        {/* Live Stock Display with warning levels */}
                        <div className="text-[10px] font-bold">
                          {isOut ? (
                            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              ❌ OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 animate-pulse">
                              ⚠️ LOW: {liveStock} {med.unit}s
                            </span>
                          ) : (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              🟢 {liveStock} {med.unit}s left
                            </span>
                          )}
                        </div>

                        {/* Click to add button */}
                        <button
                          type="button"
                          disabled={isOut}
                          onClick={() => handleAddMedicine(med)}
                          className={`btn px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                            isOut
                              ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/10 hover:scale-[1.03] active:scale-[0.97]'
                          }`}
                        >
                          <FiPlus /> Prescribe
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
