import { useState, useEffect } from 'react';
import { patientsAPI } from '../../api';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    loadPatients();
  }, []);

  const loadPatients = () => {
    patientsAPI.getAll()
      .then(r => { setPatients(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const deletePatient = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this patient record?')) {
      try {
        await patientsAPI.delete(id);
        setPatients(prev => prev.filter(p => p._id !== id));
        toast.success('Patient record deleted successfully');
      } catch (err) {
        toast.error('Failed to delete patient record');
      }
    }
  };

  const filtered = patients.filter(p =>
    p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-500">Patient Records</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-10 w-64" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Address</th>
              <th>Contact</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> :
            filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">No patients found</td></tr> :
            filtered.map((p, i) => (
              <tr key={p._id || i}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-xs font-bold">{p.userId?.name?.charAt(0) || '?'}</div>
                    <div><p className="font-medium text-sm">{p.userId?.name}</p><p className="text-xs text-gray-400">{p.userId?.email}</p></div>
                  </div>
                </td>
                <td>{p.age}</td>
                <td className="capitalize">{p.gender}</td>
                <td><span className="badge-info">{p.bloodGroup || 'N/A'}</span></td>
                <td className="text-xs">{p.address || '—'}</td>
                <td className="text-xs">{p.userId?.phone || '—'}</td>
                <td className="text-center">
                  <button 
                    onClick={() => deletePatient(p._id)} 
                    className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors hover:text-red-600"
                    title="Delete Patient"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
