import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { prescriptionsAPI, deliveriesAPI } from '../../api';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pRes, dRes] = await Promise.all([prescriptionsAPI.getAll(), deliveriesAPI.getAll()]);
      setPrescriptions(pRes.data || []);
      setDeliveries(dRes.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const createDelivery = async (prescriptionId) => {
    try {
      await deliveriesAPI.create({ prescriptionId });
      toast.success('Delivery created!');
      loadData();
    } catch { toast.error('Failed'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await deliveriesAPI.updateStatus(id, { status });
      toast.success(`Status: ${status}`);
      loadData();
    } catch { toast.error('Failed'); }
  };

  const pending = deliveries.filter(d => d.status === 'pending').length;
  const processing = deliveries.filter(d => d.status === 'processing').length;
  const delivered = deliveries.filter(d => d.status === 'delivered').length;

  const cards = [
    { icon: FiPackage, label: 'Prescriptions', value: prescriptions.length, bg: 'bg-blue-50', color: 'text-medical-blue' },
    { icon: FiClock, label: 'Pending', value: pending, bg: 'bg-orange-50', color: 'text-medical-orange' },
    { icon: FiTruck, label: 'Processing', value: processing, bg: 'bg-purple-50', color: 'text-medical-purple' },
    { icon: FiCheckCircle, label: 'Delivered', value: delivered, bg: 'bg-accent-50', color: 'text-accent-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary-500">Pharmacy Hub 💊</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className={`stat-icon ${s.bg}`}><s.icon className={`text-2xl ${s.color}`} /></div>
            <div><p className="text-2xl font-bold text-primary-500">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold text-primary-500 mb-4">Recent Prescriptions</h3>
          {prescriptions.length === 0 ? <p className="text-gray-400 text-sm py-4 text-center">No prescriptions</p> : (
            <div className="space-y-3">
              {prescriptions.slice(0, 6).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{p.patientId?.userId?.name || 'Patient'}</p>
                    <p className="text-xs text-gray-400">{p.medicines?.length || 0} medicines · {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => createDelivery(p._id)} className="btn-accent text-xs py-1.5 px-3">Create Delivery</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-primary-500 mb-4">Active Deliveries</h3>
          {deliveries.length === 0 ? <p className="text-gray-400 text-sm py-4 text-center">No deliveries</p> : (
            <div className="space-y-3">
              {deliveries.slice(0, 6).map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Delivery #{d._id?.slice(-6)}</p>
                    <p className="text-xs text-gray-400">{d.status}</p>
                  </div>
                  <div className="flex gap-1">
                    {d.status === 'pending' && <button onClick={() => updateStatus(d._id, 'processing')} className="badge-warning cursor-pointer hover:opacity-80">Process</button>}
                    {d.status === 'processing' && <button onClick={() => updateStatus(d._id, 'shipped')} className="badge-info cursor-pointer hover:opacity-80">Ship</button>}
                    {d.status === 'shipped' && <button onClick={() => updateStatus(d._id, 'delivered')} className="badge-success cursor-pointer hover:opacity-80">Delivered</button>}
                    {d.status === 'delivered' && <span className="badge-success">✓ Done</span>}
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
