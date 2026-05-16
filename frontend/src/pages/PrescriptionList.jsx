import { useState, useEffect } from 'react';
import { prescriptionsAPI } from '../api';
import { motion } from 'framer-motion';
import { FiFileText, FiCalendar, FiUser, FiActivity } from 'react-icons/fi';

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionsAPI.getAll()
      .then(r => {
        setPrescriptions(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-500">Medical Prescriptions</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="glass-card text-center py-12">
          <FiFileText className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No prescriptions found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card hover:border-accent-300 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-accent-50 transition-colors">
                  <FiFileText className="text-medical-blue group-hover:text-accent-500" />
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <FiCalendar /> {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400 text-sm" />
                  <p className="text-sm font-semibold text-gray-700">
                    Patient: <span className="text-primary-500">{p.patientId?.userId?.name || 'Loading...'}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiUser className="text-medical-blue text-sm" />
                  <p className="text-xs font-medium text-gray-500">
                    By: Dr. {p.doctorId?.name || 'Unknown'} ({p.doctorId?.specialization || 'Consultant'})
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiActivity className="text-gray-400 text-sm" />
                  <p className="text-sm font-medium text-gray-600">
                    Diagnosis: <span className="italic">{p.diagnosis || 'General checkup'}</span>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medicines</p>
                  <div className="space-y-2">
                    {p.medicines?.map((m, j) => (
                      <div key={j} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg">
                        <span className="font-medium text-gray-700">{m.name}</span>
                        <span className="text-xs text-gray-500">{m.dosage} ({m.duration})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {p.instructions && (
                  <div className="mt-3 p-3 bg-accent-50/30 rounded-lg">
                    <p className="text-xs text-accent-700 font-medium italic">"{p.instructions}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
