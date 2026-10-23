import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

import SignIn from '@/pages/SignIn';
import Register from '@/pages/farmer/Register';

import FarmerLayout from '@/pages/farmer/FarmerLayout';
import FarmerHome from '@/pages/farmer/Home';
import Farms from '@/pages/farmer/Farms';
import Services from '@/pages/farmer/Services';
import Report from '@/pages/farmer/Report';
import Inbox from '@/pages/farmer/Inbox';
import Profile from '@/pages/farmer/Profile';

import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Registry from '@/pages/admin/Registry';
import Applications from '@/pages/admin/Applications';
import DiseaseControl from '@/pages/admin/DiseaseControl';
import Extension from '@/pages/admin/Extension';
import Grants from '@/pages/admin/Grants';
import Communications from '@/pages/admin/Communications';
import Reports from '@/pages/admin/Reports';
import Administration from '@/pages/admin/Administration';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute portal="farmer" />}>
        <Route element={<FarmerLayout />}>
          <Route path="/app" element={<FarmerHome />} />
          <Route path="/app/home" element={<FarmerHome />} />
          <Route path="/app/farms" element={<Farms />} />
          <Route path="/app/services" element={<Services />} />
          <Route path="/app/report" element={<Report />} />
          <Route path="/app/inbox" element={<Inbox />} />
          <Route path="/app/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute portal="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="registry" element={<Registry />} />
          <Route path="applications" element={<Applications />} />
          <Route path="disease" element={<DiseaseControl />} />
          <Route path="extension" element={<Extension />} />
          <Route path="grants" element={<Grants />} />
          <Route path="communications" element={<Communications />} />
          <Route path="reports" element={<Reports />} />
          <Route path="administration" element={<Administration />} />
        </Route>
      </Route>

      <Route path="/" element={<SignIn />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;