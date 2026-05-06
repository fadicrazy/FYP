import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../api';
import { FiUsers, FiVideo, FiFileText, FiTruck, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0A2540', '#2ECC71', '#3498DB', '#E74C3C', '#F39C12', '#9B59B6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;

  const roleData = (stats?.usersByRole || []).map(r => ({ name: r._id, value: r.count }));
  const statusData = (stats?.consultationsByStatus || []).map(r => ({ name: r._id, count: r.count }));

  const cards = [
    { icon: FiUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-medical-blue', bg: 'bg-blue-50' },
    { icon: FiActivity, label: 'Patients', value: stats?.totalPatients || 0, color: 'text-accent-500', bg: 'bg-accent-50' },
    { icon: FiVideo, label: 'Consultations', value: stats?.totalConsultations || 0, color: 'text-medical-purple', bg: 'bg-purple-50' },
    { icon: FiFileText, label: 'Prescriptions', value: stats?.totalPrescriptions || 0, color: 'text-medical-orange', bg: 'bg-orange-50' },
    { icon: FiTruck, label: 'Deliveries', value: stats?.totalDeliveries || 0, color: 'text-medical-red', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary-500">Admin Dashboard 🛡️</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`stat-icon ${s.bg}`}><s.icon className={`text-xl ${s.color}`} /></div>
            <div><p className="text-xl font-bold text-primary-500">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold text-primary-500 mb-4">Users by Role</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-primary-500 mb-4">Consultations by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2ECC71" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="glass-card">
        <h3 className="font-semibold text-primary-500 mb-4">Recent Users</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {(stats?.recentUsers || []).map((u, i) => (
                <tr key={i}>
                  <td className="font-medium">{u.name}</td>
                  <td className="text-sm text-gray-500">{u.email}</td>
                  <td><span className="badge-info capitalize">{u.role}</span></td>
                  <td>{u.isApproved ? <span className="badge-success">Approved</span> : <span className="badge-warning">Pending</span>}</td>
                  <td className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
