import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ title }) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="ml-64">
        <Header title={title || 'Dashboard'} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
