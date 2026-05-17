import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';


// Nurse
import NurseDashboard from './pages/nurse/NurseDashboard';
import AddPatient from './pages/nurse/AddPatient';
import PatientList from './pages/nurse/PatientList';
import RecordVitals from './pages/nurse/RecordVitals';
import RequestConsultation from './pages/nurse/RequestConsultation';

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ConsultationQueue from './pages/doctor/ConsultationQueue';
import CreatePrescription from './pages/doctor/CreatePrescription';
import VitalsViewer from './pages/doctor/VitalsViewer';
import DoctorAnalytics from './pages/doctor/DoctorAnalytics';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';

// Shared
import PrescriptionList from './pages/PrescriptionList';

// Pharmacy
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import Deliveries from './pages/pharmacy/Deliveries';
import Inventory from './pages/pharmacy/Inventory';
import Reports from './pages/pharmacy/Reports';

// Protected Route wrapper
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

import VideoRoom from './pages/VideoRoom';

// Dashboard router based on role
function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'doctor') return <DoctorDashboard />;
  if (role === 'nurse') return <NurseDashboard />;
  if (role === 'pharmacy') return <PharmacyDashboard />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardRouter />} />
        
        {/* Real-time Consultation Room */}
        <Route path="consultation/:id" element={<ProtectedRoute roles={['doctor', 'nurse']}><VideoRoom /></ProtectedRoute>} />

        {/* Nurse routes */}
        <Route path="add-patient" element={<ProtectedRoute roles={['nurse', 'admin']}><AddPatient /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute roles={['nurse', 'doctor', 'admin']}><PatientList /></ProtectedRoute>} />
        <Route path="vitals" element={<ProtectedRoute roles={['nurse']}><RecordVitals /></ProtectedRoute>} />
        <Route path="request-consultation" element={<ProtectedRoute roles={['nurse']}><RequestConsultation /></ProtectedRoute>} />

        {/* Doctor routes */}
        <Route path="queue" element={<ProtectedRoute roles={['doctor']}><ConsultationQueue /></ProtectedRoute>} />
        <Route path="prescriptions" element={<ProtectedRoute roles={['doctor', 'nurse', 'patient', 'pharmacy']}><PrescriptionList /></ProtectedRoute>} />
        <Route path="create-prescription/:patientId" element={<ProtectedRoute roles={['doctor']}><CreatePrescription /></ProtectedRoute>} />
        <Route path="vitals-viewer" element={<ProtectedRoute roles={['doctor']}><VitalsViewer /></ProtectedRoute>} />
        <Route path="doctor-analytics" element={<ProtectedRoute roles={['doctor']}><DoctorAnalytics /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="activity" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        {/* Pharmacy routes */}
        <Route path="deliveries" element={<ProtectedRoute roles={['pharmacy', 'admin']}><Deliveries /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute roles={['pharmacy', 'admin']}><Inventory /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute roles={['pharmacy', 'admin']}><Reports /></ProtectedRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { background: '#0A2540', color: '#fff', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#2ECC71', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E74C3C', secondary: '#fff' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
