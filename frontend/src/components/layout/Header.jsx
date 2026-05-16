import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { notificationsAPI } from '../../api';
import { FiBell, FiSearch, FiCheck, FiTrash2, FiClock } from 'react-icons/fi';

// Simple time-ago helper
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return Math.floor(seconds) + " secs ago";
};

export default function Header({ title }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        notificationsAPI.getAll(),
        notificationsAPI.getUnreadCount()
      ]);
      setNotifications(notifsRes.data);
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <header className="h-16 glass border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h2 className="text-lg font-semibold text-primary-500">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100/80 rounded-xl px-4 py-2">
          <FiSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-40 placeholder:text-gray-400"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showDropdown ? 'bg-primary-500 text-white' : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'}`}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-medical-red rounded-full text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                  >
                    <FiCheck /> Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id} 
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                      onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                    >
                      {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${n.type === 'success' ? 'text-green-500' : n.type === 'warning' ? 'text-orange-500' : 'text-primary-500'}`}>
                          {n.type}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <FiClock /> {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <h4 className={`text-sm mb-1 ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{n.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiBell className="text-gray-300 text-2xl" />
                    </div>
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50/50 border-t border-gray-50 text-center">
                <button className="text-xs text-gray-500 hover:text-primary-500 font-medium">
                  View all activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-primary-500 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
