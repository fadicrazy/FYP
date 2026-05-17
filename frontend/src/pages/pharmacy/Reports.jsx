import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { inventoryAPI } from '../../api';
import {
  FiBarChart2, FiPrinter, FiDollarSign, FiPackage, FiLayers,
  FiTrendingUp, FiCheckCircle, FiActivity, FiTruck
} from 'react-icons/fi';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, medRes] = await Promise.all([
        inventoryAPI.getStats(),
        inventoryAPI.getAll()
      ]);
      setStats(statsRes.data);
      setMedicines(medRes.data || []);
    } catch {
      toast.error('Failed to generate reports data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate Reports Summary Metrics
  const totalStock = medicines.reduce((acc, curr) => acc + curr.stock, 0);
  const totalValuation = medicines.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);
  const averagePrice = medicines.length > 0 ? (medicines.reduce((acc, curr) => acc + curr.price, 0) / medicines.length) : 0;
  
  // Categorize medicine counts for Donut Chart
  const categoryCounts = medicines.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const categoryBreakdownData = Object.keys(categoryCounts).map((cat, idx) => {
    const colors = ['#3498DB', '#2ECC71', '#9B59B6', '#F39C12', '#1ABC9C', '#E74C3C', '#E67E22', '#34495E'];
    return {
      name: cat,
      value: categoryCounts[cat],
      color: colors[idx % colors.length]
    };
  });

  const cards = [
    { label: 'Total Valuation', value: `$${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: FiDollarSign, bg: 'bg-emerald-50 text-emerald-600', desc: 'Net asset worth of inventory' },
    { label: 'Total Stock Units', value: totalStock, icon: FiPackage, bg: 'bg-blue-50 text-medical-blue', desc: 'Sum of all items in pharmacy' },
    { label: 'Formulas Registered', value: medicines.length, icon: FiLayers, bg: 'bg-purple-50 text-medical-purple', desc: 'Distinct chemical medicines' },
    { label: 'Average Unit Cost', value: `$${averagePrice.toFixed(2)}`, icon: FiActivity, bg: 'bg-amber-50 text-medical-orange', desc: 'Average cost per single tablet/vial' }
  ];

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:space-y-6">
      {/* Header Panel (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-500 tracking-tight">Analytical Reports & Audit</h1>
          <p className="text-sm text-gray-500">Review assets, distribution rates, and printable stock valuations</p>
        </div>
        <button
          onClick={handlePrint}
          className="btn-primary flex items-center gap-2 font-bold py-2.5 px-5 shadow-lg shadow-primary-500/20"
        >
          <FiPrinter /> Print Audit Sheet
        </button>
      </div>

      {/* Audit Banner for Print Only */}
      <div className="hidden print:block text-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-black text-primary-500">TeleHealth Pharmacy System Audit Sheet</h1>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()} · Official Ledger Record</p>
      </div>

      {/* Grid of Report Summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="glass-card flex items-center gap-4 border border-gray-100 shadow-sm print:bg-white print:border-gray-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${c.bg}`}>
              <c.icon />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{c.label}</p>
              <p className="text-xl font-extrabold text-primary-500 mt-0.5">{c.value}</p>
              <p className="text-[10px] text-gray-500 font-medium leading-normal print:hidden">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Revenue Performance Area Chart */}
        <div className="glass-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-primary-500 text-lg">Revenue Stream Overview</h3>
              <p className="text-xs text-gray-400">Monthly calculated pharmacy revenue based on dispatched prescriptions</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              <FiTrendingUp className="inline mr-1" /> Upward Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyDispensTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="count" stroke="#2ECC71" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-primary-500 text-lg">Formula Categories</h3>
            <p className="text-xs text-gray-400">Distribution of registered medicines across categories</p>
          </div>
          <div className="h-44 w-full my-3 flex items-center justify-center">
            {categoryBreakdownData.length === 0 ? (
              <p className="text-gray-400 text-xs italic">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-1.5 text-[10px] font-bold overflow-y-auto max-h-36 pr-1 custom-scrollbar">
            {categoryBreakdownData.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-50/50 rounded border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: entry.color }} />
                  <span className="text-gray-600 truncate max-w-[120px]">{entry.name}</span>
                </div>
                <span className="text-primary-500">{entry.value} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Valuation List (Becomes main layout on Print) */}
      <div className="glass-card shadow-lg print:border print:bg-white print:p-4 print:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-primary-500 text-lg">Inventory Asset Audit Ledger</h3>
            <p className="text-xs text-gray-400">Current financial valuation and stock details for registered formulas</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg print:hidden">
            {medicines.length} Medicines Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-xs font-bold uppercase">
                <th className="pb-3">Medicine Formula</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Unit Cost</th>
                <th className="pb-3">Stock Count</th>
                <th className="pb-3 text-right">Asset Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {medicines.map((med, idx) => {
                const valuation = med.stock * med.price;
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 text-xs text-gray-700">
                    <td className="py-3 font-bold text-primary-500">{med.name}</td>
                    <td className="py-3 text-gray-500 font-medium">{med.category}</td>
                    <td className="py-3 font-semibold text-gray-600">${med.price.toFixed(2)}</td>
                    <td className="py-3 font-bold text-gray-600">{med.stock} {med.unit}s</td>
                    <td className="py-3 font-black text-primary-500 text-right">
                      ${valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
              {/* Grand Total Row */}
              <tr className="border-t border-gray-300 font-black text-primary-500 text-sm">
                <td colSpan="3" className="py-4 text-left">Grand Total Value:</td>
                <td className="py-4 font-bold text-gray-600">{totalStock} units</td>
                <td className="py-4 text-right text-emerald-600">
                  ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
