import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { deliveriesAPI } from '../../api';
import {
  FiTruck, FiClock, FiCheckCircle, FiPackage, FiSearch,
  FiMapPin, FiCalendar, FiFileText, FiChevronRight, FiEdit2, FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal for adding tracking notes / changing status
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [trackingNotes, setTrackingNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const res = await deliveriesAPI.getAll();
      setDeliveries(res.data || []);
    } catch {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDelivery = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this shipment record?')) {
      try {
        await deliveriesAPI.delete(id);
        setDeliveries(prev => prev.filter(d => d._id !== id));
        toast.success('Shipment record deleted successfully');
      } catch (err) {
        toast.error('Failed to delete shipment');
      }
    }
  };

  const openStatusModal = (delivery, status) => {
    setSelectedDelivery(delivery);
    setNewStatus(status);
    setTrackingNotes(delivery.trackingNotes || '');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedDelivery) return;
    try {
      await deliveriesAPI.updateStatus(selectedDelivery._id, {
        status: newStatus,
        trackingNotes: trackingNotes
      });
      toast.success(`Delivery status updated to ${newStatus}!`);
      setIsModalOpen(false);
      loadDeliveries();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const patientName = d.prescriptionId?.patientId?.userId?.name || '';
    const doctorName = d.prescriptionId?.doctorId?.name || '';
    const address = d.deliveryAddress || '';
    const id = d._id || '';

    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const statuses = [
    { value: 'all', label: 'All Shipments', count: deliveries.length, color: 'text-primary-500 bg-primary-50' },
    { value: 'pending', label: 'Pending', count: deliveries.filter(d => d.status === 'pending').length, color: 'text-medical-orange bg-amber-50' },
    { value: 'processing', label: 'Processing', count: deliveries.filter(d => d.status === 'processing').length, color: 'text-medical-purple bg-purple-50' },
    { value: 'shipped', label: 'Shipped', count: deliveries.filter(d => d.status === 'shipped').length, color: 'text-medical-blue bg-blue-50' },
    { value: 'delivered', label: 'Delivered', count: deliveries.filter(d => d.status === 'delivered').length, color: 'text-accent-600 bg-accent-50' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-500 tracking-tight">Home Deliveries Dispatch</h1>
          <p className="text-sm text-gray-500">Track and manage doorstep prescription deliveries for patients</p>
        </div>
      </div>

      {/* Stats / Filter bar */}
      <div className="flex flex-wrap gap-3">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border flex items-center gap-2 hover:shadow-md ${
              statusFilter === s.value
                ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25 scale-[1.02]'
                : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
            }`}
          >
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${statusFilter === s.value ? 'bg-white/20 text-white' : s.color}`}>
              {s.count}
            </span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search by Patient Name, Doctor, ID, Address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12 shadow-sm focus:shadow-md"
        />
      </div>

      {/* Deliveries list */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FiTruck className="text-gray-300 text-5xl mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-primary-500">No shipments found</h3>
          <p className="text-gray-400 text-sm mt-1">There are no deliveries matching your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDeliveries.map((delivery, i) => {
            const statusStyles = {
              pending: { bg: 'bg-amber-50 border-amber-100 text-medical-orange', label: 'Pending Process' },
              processing: { bg: 'bg-purple-50 border-purple-100 text-medical-purple', label: 'In Packaging' },
              shipped: { bg: 'bg-blue-50 border-blue-100 text-medical-blue', label: 'Shipped (In Transit)' },
              delivered: { bg: 'bg-accent-50 border-accent-100 text-accent-600', label: 'Completed Doorstep' }
            }[delivery.status] || { bg: 'bg-gray-50 border-gray-100 text-gray-500', label: 'Unknown' };

            const creationDate = new Date(delivery.createdAt).toLocaleDateString();
            const medicines = delivery.prescriptionId?.medicines || [];

            return (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card flex flex-col justify-between border hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 border-b border-gray-100/50 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Shipment ID</span>
                      <h4 className="font-extrabold text-primary-500 text-sm">#{delivery._id?.slice(-8).toUpperCase()}</h4>
                    </div>
                    <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border ${statusStyles.bg}`}>
                      {statusStyles.label}
                    </span>
                  </div>

                  {/* Shipment Info details */}
                  <div className="space-y-3.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                        <FiPackage />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Patient / Recipient</p>
                        <p className="font-bold text-gray-800">{delivery.prescriptionId?.patientId?.userId?.name || 'Patient Name'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 mt-0.5">
                        <FiMapPin />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Delivery Address</p>
                        <p className="font-medium text-gray-700 leading-normal">{delivery.deliveryAddress || 'Address not listed, default dispatch'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                        <FiCalendar />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Date Initiated</p>
                        <p className="font-bold text-gray-700">{creationDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 mt-0.5">
                        <FiFileText />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Prescribed Medicines ({medicines.length})</p>
                        {medicines.length === 0 ? (
                          <p className="text-gray-400 italic">No medicines listed</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {medicines.map((m, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[10px] font-bold border border-gray-200/50">
                                {m.name} ({m.dosage})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {delivery.trackingNotes && (
                      <div className="p-3 bg-blue-50/30 border border-blue-100/50 rounded-xl mt-3 text-xs text-blue-800">
                        <strong className="font-bold">Log Notes:</strong> {delivery.trackingNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pipeline Controls */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-medium text-gray-400">
                    {delivery.deliveredAt && `Delivered: ${new Date(delivery.deliveredAt).toLocaleDateString()}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteDelivery(delivery._id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors hover:text-red-600 mr-2"
                      title="Delete Shipment"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                    {delivery.status === 'pending' && (
                      <button
                        onClick={() => openStatusModal(delivery, 'processing')}
                        className="btn-accent text-[11px] font-bold py-2 px-4 shadow-sm flex items-center gap-1"
                      >
                        Process Package <FiChevronRight />
                      </button>
                    )}
                    {delivery.status === 'processing' && (
                      <button
                        onClick={() => openStatusModal(delivery, 'shipped')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-[11px] transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                      >
                        Ship Order <FiTruck />
                      </button>
                    )}
                    {delivery.status === 'shipped' && (
                      <button
                        onClick={() => openStatusModal(delivery, 'delivered')}
                        className="btn-primary text-[11px] font-bold py-2 px-4 shadow-sm flex items-center gap-1"
                      >
                        Mark Delivered <FiCheckCircle />
                      </button>
                    )}
                    {delivery.status === 'delivered' && (
                      <span className="text-xs font-bold text-accent-600 bg-accent-50 border border-accent-150 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                        ✓ Dispatched successfully
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal for notes / status confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-150"
          >
            <h3 className="text-xl font-bold text-primary-500 mb-2">Update Delivery Logistics</h3>
            <p className="text-xs text-gray-500 mb-5">
              Confirm status change of Shipment to <strong className="text-primary-500 uppercase">{newStatus}</strong>. Enter tracking log notes below.
            </p>

            <div className="space-y-4">
              <div>
                <label className="input-label flex items-center gap-1"><FiEdit2 /> Tracking Logs / Notes</label>
                <textarea
                  value={trackingNotes}
                  onChange={(e) => setTrackingNotes(e.target.value)}
                  placeholder="Enter courier name, tracking number, temperature status, or details..."
                  className="input-field h-24 resize-none py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-ghost text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="btn-primary text-xs py-2 px-5"
              >
                Confirm Dispatch Transition
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
