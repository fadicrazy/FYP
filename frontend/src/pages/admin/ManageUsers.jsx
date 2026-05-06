import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => adminAPI.getUsers(filter || undefined).then(r => { setUsers(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => { await adminAPI.approveUser(id); toast.success('Approved!'); load(); };
  const deactivate = async (id) => { await adminAPI.deactivateUser(id); toast.success('Deactivated'); load(); };
  const remove = async (id) => { if (confirm('Delete this user?')) { await adminAPI.deleteUser(id); toast.success('Deleted'); load(); } };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-primary-500 mb-6">Manage Users</h1>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-10" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['', 'admin', 'doctor', 'nurse', 'patient', 'pharmacy'].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === r ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>User</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i}>
                <td><div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-xs font-bold">{u.name?.charAt(0)}</div>
                  <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div></td>
                <td><span className="badge-info capitalize">{u.role}</span></td>
                <td className="text-sm">{u.phone || '—'}</td>
                <td>{u.isApproved ? <span className="badge-success">Active</span> : <span className="badge-warning">Pending</span>}</td>
                <td className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {!u.isApproved && <button onClick={() => approve(u._id)} className="p-1.5 rounded-lg bg-accent-50 text-accent-500 hover:bg-accent-100"><FiCheck /></button>}
                    <button onClick={() => deactivate(u._id)} className="p-1.5 rounded-lg bg-orange-50 text-medical-orange hover:bg-orange-100"><FiX /></button>
                    <button onClick={() => remove(u._id)} className="p-1.5 rounded-lg bg-red-50 text-medical-red hover:bg-red-100"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
