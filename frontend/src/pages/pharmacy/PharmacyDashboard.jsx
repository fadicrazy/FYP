import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { prescriptionsAPI, deliveriesAPI, inventoryAPI } from '../../api';
import {
  FiPackage, FiTruck, FiCheckCircle, FiClock,
  FiAlertTriangle, FiDollarSign, FiActivity, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    weeklyPrescriptions: [],
    deliveryStatusBreakdown: [],
    monthlyDispensTrend: []
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, pRes, mRes] = await Promise.all([
        inventoryAPI.getStats(),
        prescriptionsAPI.getAll(),
        inventoryAPI.getAll({ lowStock: 'true' })
      ]);
      
      if (statsRes.data) setStats(statsRes.data);
      setPrescriptions(pRes.data || []);
      setLowStockMedicines(mRes.data || []);
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const createDelivery = async (prescriptionId) => {
    try {
      await deliveriesAPI.create({ prescriptionId });
      toast.success('Delivery initiated successfully!');
      loadData();
    } catch {
      toast.error('Failed to initiate delivery');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      icon: FiPackage,
      label: 'Prescriptions',
      value: stats.totalPrescriptions,
      bg: 'bg-blue-50/80',
      color: 'text-medical-blue border-blue-100',
      desc: 'All-time prescriptions received'
    },
    {
      icon: FiClock,
      label: 'Pending Orders',
      value: stats.pending,
      bg: 'bg-amber-50/80',
      color: 'text-medical-orange border-amber-100',
      desc: 'Awaiting fulfillment process'
    },
    {
      icon: FiTruck,
      label: 'Processing',
      value: stats.processing,
      bg: 'bg-purple-50/80',
      color: 'text-medical-purple border-purple-100',
      desc: 'Currently being packaged/shipped'
    },
    {
      icon: FiCheckCircle,
      label: 'Delivered',
      value: stats.delivered,
      bg: 'bg-emerald-50/80',
      color: 'text-emerald-500 border-emerald-100',
      desc: 'Orders successfully dispatched'
    },
    {
      icon: FiAlertTriangle,
      label: 'Low Stock Alert',
      value: stats.lowStockCount,
      bg: 'bg-red-50/80',
      color: 'text-medical-red border-red-100 ring-2 ring-red-200/50',
      desc: 'Medicines below safety limits',
      urgent: stats.lowStockCount > 0
    },
    {
      icon: FiDollarSign,
      label: 'Today\'s Revenue',
      value: `$${stats.todayRevenue}`,
      bg: 'bg-teal-50/80',
      color: 'text-teal-600 border-teal-100',
      desc: 'Income from dispatched items today'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-medical p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Pharmacy Intelligence Hub 🏥</h1>
          <p className="text-white/80 font-medium text-sm md:text-base">
            Monitor real-time inventory safety levels, medicine dispense rates, and home delivery streams.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
          <FiTrendingUp className="text-accent-300 text-xl" />
          <div>
            <p className="text-xs text-white/60 font-semibold uppercase">Platform Status</p>
            <p className="text-sm font-bold text-accent-300">Live & Syncing</p>
          </div>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card flex flex-col justify-between border p-5 ${card.urgent ? 'ring-2 ring-medical-red/40 animate-pulse-slow bg-red-50/30' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${card.bg}`}>
                <card.icon className={`${card.color.split(' ')[0]}`} />
              </div>
              {card.urgent && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-black text-primary-500 tracking-tight">{card.value}</p>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{card.label}</h3>
              <p className="text-[10px] text-gray-500 mt-2 font-medium leading-relaxed">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Prescriptions Bar Chart */}
        <div className="glass-card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-primary-500 text-lg">Weekly Prescriptions Received</h3>
              <p className="text-xs text-gray-400">Total volume of clinical prescriptions submitted over the last 7 days</p>
            </div>
            <span className="text-xs font-semibold text-medical-blue bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <FiActivity /> 7-Day Window
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyPrescriptions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3498DB" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#2980B9" stopOpacity={0.35}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(52, 152, 219, 0.05)' }}
                />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Status Breakdown Pie Chart */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-primary-500 text-lg mb-1">Delivery Pipeline</h3>
            <p className="text-xs text-gray-400">Active distribution and dispatch status breakdown</p>
          </div>
          <div className="h-52 w-full my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.deliveryStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.deliveryStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold mt-2">
            {stats.deliveryStatusBreakdown.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50/60 rounded-lg border border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600 truncate">{entry.name}: <strong className="text-primary-500 font-bold">{entry.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Medicine Dispense Trend - Line Chart */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-primary-500 text-lg">Medicine Dispense Trend</h3>
            <p className="text-xs text-gray-400">6-Month historical overview of total medicine units dispensed through successful deliveries</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
              ✓ Verified Dispatches
            </span>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyDispensTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ECC71" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="#2ECC71" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="count" stroke="#2ECC71" strokeWidth={3} dot={{ fill: '#2ECC71', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section: Low Stock Warnings & Recent Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="glass-card border border-red-100 shadow-lg shadow-red-500/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-medical-red">
              <FiAlertTriangle />
            </div>
            <div>
              <h3 className="font-bold text-primary-500">Low Stock Critical Medicines</h3>
              <p className="text-xs text-gray-400">Restock recommended immediately to maintain prescription fulfillment capabilities</p>
            </div>
          </div>

          {lowStockMedicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-emerald-50/20 border border-dashed border-emerald-100 rounded-2xl text-center px-4">
              <FiCheckCircle className="text-emerald-500 text-3xl mb-2 animate-bounce" />
              <p className="text-emerald-700 font-bold text-sm">All Inventory Stocks Optimal!</p>
              <p className="text-emerald-600 text-xs mt-0.5">No medicines are running below threshold safety limits.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Medicine</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Stock</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Min. Req</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {lowStockMedicines.slice(0, 5).map((med, idx) => {
                    const ratio = Math.max(0, Math.min(100, (med.stock / med.minStock) * 100));
                    return (
                      <tr key={idx} className="hover:bg-red-50/10">
                        <td className="py-3 text-sm font-semibold text-gray-700 flex flex-col">
                          <span>{med.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{med.category}</span>
                        </td>
                        <td className="py-3 text-sm font-bold text-medical-red">{med.stock} {med.unit}s</td>
                        <td className="py-3 text-sm font-medium text-gray-500">{med.minStock} {med.unit}s</td>
                        <td className="py-3 text-xs">
                          <div className="w-24">
                            <div className="flex justify-between text-[9px] font-bold text-medical-red mb-1">
                              <span>CRITICAL</span>
                              <span>{Math.round(ratio)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-medical-red h-full rounded-full" style={{ width: `${ratio}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-medical-blue">
                <FiPackage />
              </div>
              <div>
                <h3 className="font-bold text-primary-500">Recent Prescriptions</h3>
                <p className="text-xs text-gray-400">Newly received clinical orders ready for delivery dispatch</p>
              </div>
            </div>
          </div>

          {prescriptions.length === 0 ? (
            <p className="text-gray-400 text-sm py-12 text-center bg-gray-50/50 rounded-2xl">No recent prescriptions found</p>
          ) : (
            <div className="space-y-3">
              {prescriptions.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-gray-50 transition-all duration-200">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-primary-500">{p.patientId?.userId?.name || 'Patient'}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <span className="bg-primary-50 px-2 py-0.5 rounded text-primary-600 font-bold text-[10px] uppercase">
                        {p.medicines?.length || 0} meds
                      </span>
                      <span>·</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => createDelivery(p._id)}
                    className="btn-accent text-xs py-2 px-4 shadow-sm hover:shadow-md flex items-center gap-1 font-bold"
                  >
                    Initiate Delivery <FiArrowRight />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
