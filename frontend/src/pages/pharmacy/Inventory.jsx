import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { inventoryAPI } from '../../api';
import {
  FiPackage, FiPlus, FiSearch, FiEdit, FiTrash2,
  FiFilter, FiAlertTriangle, FiCheckCircle, FiDollarSign, FiLayers
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Analgesics',
    stock: 100,
    minStock: 10,
    price: 10,
    unit: 'Tablet',
    manufacturer: ''
  });

  useEffect(() => {
    loadMedicines();
  }, [category, lowStockFilter]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (lowStockFilter) params.lowStock = 'true';
      const res = await inventoryAPI.getAll(params);
      setMedicines(res.data || []);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMedicines();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'minStock' || name === 'price' ? Number(value) : value
    }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Analgesics',
      stock: 100,
      minStock: 10,
      price: 10,
      unit: 'Tablet',
      manufacturer: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (med) => {
    setCurrentMed(med);
    setFormData({
      name: med.name,
      category: med.category,
      stock: med.stock,
      minStock: med.minStock,
      price: med.price,
      unit: med.unit,
      manufacturer: med.manufacturer
    });
    setIsEditModalOpen(true);
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');
    try {
      await inventoryAPI.create(formData);
      toast.success('Medicine added successfully!');
      setIsAddModalOpen(false);
      loadMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add medicine');
    }
  };

  const handleEditMedicine = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');
    try {
      await inventoryAPI.update(currentMed._id, formData);
      toast.success('Medicine updated successfully!');
      setIsEditModalOpen(false);
      loadMedicines();
    } catch {
      toast.error('Failed to update medicine');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await inventoryAPI.delete(id);
      toast.success('Medicine deleted from inventory');
      loadMedicines();
    } catch {
      toast.error('Failed to delete medicine');
    }
  };

  // Extract unique categories for dropdown filter
  const categoriesList = ['Analgesics', 'Antibiotics', 'Cardiology', 'Antidiabetic', 'Respiratory', 'Vitamins', 'Gastroenterology', 'Others'];

  // Local filter for instant search matching on screen
  const searchedMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-500 tracking-tight">Pharmacy Stock Ledger</h1>
          <p className="text-sm text-gray-500">Configure medicine records, pricing profiles, and active stock thresholds</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-accent flex items-center gap-2 font-bold py-2.5 px-5 shadow-lg shadow-accent-400/25 self-start sm:self-auto"
        >
          <FiPlus /> Add New Medicine
        </button>
      </div>

      {/* Filter Options Panel */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by Name, Brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 shadow-inner"
          />
        </form>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-44">
            <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field pl-10 cursor-pointer appearance-none bg-no-repeat"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Low Stock Toggle button */}
          <button
            onClick={() => setLowStockFilter(prev => !prev)}
            className={`w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 border flex items-center justify-center gap-2 ${
              lowStockFilter
                ? 'bg-red-50 text-medical-red border-red-200 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiAlertTriangle className={lowStockFilter ? 'animate-bounce' : ''} />
            <span>Low Stock Alert</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searchedMedicines.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FiPackage className="text-gray-300 text-5xl mx-auto mb-3" />
          <h3 className="text-lg font-bold text-primary-500">No medicines in this view</h3>
          <p className="text-gray-400 text-sm mt-1">Add items or change search queries to list products.</p>
        </div>
      ) : (
        <div className="table-wrapper shadow-lg shadow-primary-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Medicine Details</th>
                  <th>Category</th>
                  <th>Pricing</th>
                  <th>Manufacturer</th>
                  <th>Safety Threshold Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchedMedicines.map((med, idx) => {
                  const isLow = med.stock <= med.minStock;
                  const ratio = Math.max(0, Math.min(100, (med.stock / med.minStock) * 100));

                  return (
                    <motion.tr
                      key={med._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                    >
                      <td className="font-semibold text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${isLow ? 'bg-red-50 text-medical-red border border-red-100' : 'bg-blue-50 text-medical-blue border border-blue-100'}`}>
                            <FiPackage />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary-500">{med.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium">Packing: {med.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200/50">
                          {med.category}
                        </span>
                      </td>
                      <td className="font-bold text-gray-700">
                        <div className="flex items-center gap-0.5 text-xs">
                          <FiDollarSign className="text-gray-400" />
                          <span>{med.price.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="text-gray-500 text-xs font-medium">{med.manufacturer || 'General Pharma'}</td>
                      <td>
                        <div className="w-40 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className={isLow ? 'text-medical-red animate-pulse' : 'text-accent-600'}>
                              {med.stock} in stock
                            </span>
                            <span className="text-gray-400">Min. {med.minStock}</span>
                          </div>
                          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isLow ? 'bg-medical-red' : 'bg-accent-400'}`}
                              style={{ width: `${Math.min(100, ratio)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(med)}
                            className="p-2 rounded-lg bg-blue-50 text-medical-blue border border-blue-100/50 hover:bg-medical-blue hover:text-white transition-all duration-300"
                            title="Edit Medicine"
                          >
                            <FiEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(med._id)}
                            className="p-2 rounded-lg bg-red-50 text-medical-red border border-red-100/50 hover:bg-medical-red hover:text-white transition-all duration-300"
                            title="Delete"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100"
          >
            <h3 className="text-xl font-bold text-primary-500 mb-4">Add Medicine Record</h3>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <label className="input-label">Medicine Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Paracetamol 500mg"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Unit Type</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="e.g. Tablet"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="input-label">Initial Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Min Stock</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Manufacturer / Brand</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="e.g. GSK, Pfizer"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-gray-150 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent text-xs py-2.5 px-5 font-bold"
                >
                  Insert Stock Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100"
          >
            <h3 className="text-xl font-bold text-primary-500 mb-4">Edit Medicine Profile</h3>
            <form onSubmit={handleEditMedicine} className="space-y-4">
              <div>
                <label className="input-label">Medicine Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field bg-gray-50/50 focus:border-gray-200 focus:ring-0 cursor-not-allowed text-gray-500"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Unit Type</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="input-label">Adjust Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Min Stock</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-gray-150 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-ghost text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-5 font-bold"
                >
                  Update Stock Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
