import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';
import GuestRoute from './router/GuestRoute';

import AdminLayout from './components/layout/AdminLayout';
import MasterLayout from './components/layout/master/MasterLayout';
import CustomerLayout from './components/layout/customer/CustomerLayout';

import AdminLogin from './pages/admin/Login';
import AdminRequests from './pages/admin/Requests';
import AdminRequestDetail from './pages/admin/RequestDetail';
import AdminMasters from './pages/admin/Masters';
import AdminMasterDetail from './pages/admin/MasterDetail';
import AdminApplications from './pages/admin/Applications';
import AdminReports from './pages/admin/Reports';
import AdminReportDetail from './pages/admin/ReportDetail';
import AdminTickets from './pages/admin/Tickets';
import AdminSettings from './pages/admin/settings/index';

import MasterLogin from './pages/master/Login';
import MasterRegister from './pages/master/Register';
import MasterHome from './pages/master/Home';
import MasterAssignmentDetail from './pages/master/AssignmentDetail';
import MasterReportForm from './pages/master/ReportForm/index'; // <-- Yeni eklenen form sayfası
import MasterEarnings from './pages/master/Earnings';
import MasterProfile from './pages/master/Profile';

import CustomerLogin from './pages/customer/Auth/Login';
import CustomerRegister from './pages/customer/Auth/Register';
import CustomerHome from './pages/customer/Home';
import CustomerNewRequest from './pages/customer/NewRequest';
import CustomerRequestDetail from './pages/customer/RequestDetail';

import LandingPage from './pages/landing-page';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Master - auth gerektirmeyen sayfalar ÖNCE */}
            <Route path="/usta/giris" element={<MasterLogin />} />
            <Route path="/usta/basvuru" element={<MasterRegister />} />

            {/* Guest */}
            <Route element={<GuestRoute />}>
              <Route path="/giris" element={<CustomerLogin />} />
              <Route path="/kayit" element={<CustomerRegister />} />
              <Route path="/admin/giris" element={<AdminLogin />} />
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/talepler" element={<AdminRequests />} />
                <Route path="/admin/talepler/:id" element={<AdminRequestDetail />} />
                <Route path="/admin/ustalar" element={<AdminMasters />} />
                <Route path="/admin/ustalar/:id" element={<AdminMasterDetail />} />
                <Route path="/admin/basvurular" element={<AdminApplications />} />
                <Route path="/admin/raporlar" element={<AdminReports />} />
                <Route path="/admin/raporlar/:id" element={<AdminReportDetail />} />
                <Route path="/admin/tickets" element={<AdminTickets />} />
                <Route path="/admin/ayarlar" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Master */}
            <Route element={<ProtectedRoute allowedRoles={['master']} />}>
              <Route element={<MasterLayout />}>
                <Route path="/usta" element={<MasterHome />} />
                <Route path="/usta/gorev/:id" element={<MasterAssignmentDetail />} />
                <Route path="/usta/rapor/:assignmentId" element={<MasterReportForm />} />
                <Route path="/usta/kazanclar" element={<MasterEarnings />} />
                <Route path="/usta/profil" element={<MasterProfile />} />
              </Route>
            </Route>

            {/* Customer */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route element={<CustomerLayout />}>
                <Route path="/musteri" element={<CustomerHome />} />
                <Route path="/musteri/yeni-talep" element={<CustomerNewRequest />} />
                <Route path="/musteri/talepler/:id" element={<CustomerRequestDetail />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}