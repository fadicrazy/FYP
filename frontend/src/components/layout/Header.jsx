import { useAuth } from '../../context/AuthContext';
import { FiBell, FiSearch } from 'react-icons/fi';

export default function Header({ title }) {
  const { user } = useAuth();

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
        <button className="relative w-10 h-10 rounded-xl bg-gray-100/80 flex items-center justify-center hover:bg-gray-200/80 transition-colors">
          <FiBell className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-medical-red rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-primary-500">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
