import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiHome, FiUsers, FiActivity, FiFileText, FiVideo,
  FiPackage, FiSettings, FiLogOut, FiHeart, FiClipboard,
  FiPlusCircle, FiBarChart2, FiShield, FiTruck
} from 'react-icons/fi';

const roleMenus = {
  nurse: [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/dashboard/add-patient', icon: FiPlusCircle, label: 'Add Patient' },
    {to: '/dashboard/patients', icon: FiUsers, label: 'Patients' },
    { to: '/dashboard/vitals', icon: FiActivity, label: 'Record Vitals' },
    { to: '/dashboard/request-consultation', icon: FiVideo, label: 'Request Consultation' },
    { to: '/dashboard/prescriptions', icon: FiFileText, label: 'Prescriptions' },
  ],
  doctor: [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/dashboard/queue', icon: FiClipboard, label: 'Consultation Queue' },
    { to: '/dashboard/patients', icon: FiUsers, label: 'Patient Records' },
    { to: '/dashboard/prescriptions', icon: FiFileText, label: 'Prescriptions' },
  ],
  admin: [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/dashboard/users', icon: FiUsers, label: 'Manage Users' },
    { to: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
    { to: '/dashboard/activity', icon: FiShield, label: 'Activity Log' },
  ],
  pharmacy: [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/dashboard/prescriptions', icon: FiFileText, label: 'Prescriptions' },
    { to: '/dashboard/deliveries', icon: FiTruck, label: 'Deliveries' },
  ],
};

const roleLabels = {
  nurse: 'Nurse Station',
  doctor: 'Doctor Console',
  admin: 'Admin Panel',
  pharmacy: 'Pharmacy Hub',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'nurse';
  const menu = roleMenus[role] || roleMenus.nurse;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-64 bg-gradient-medical flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-400 rounded-xl flex items-center justify-center">
            <FiHeart className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">TeleHealth</h1>
            <p className="text-gray-400 text-xs">{roleLabels[role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-accent-400/20 flex items-center justify-center text-accent-400 font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
