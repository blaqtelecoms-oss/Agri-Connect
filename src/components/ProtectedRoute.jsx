import { Navigate, Outlet } from 'react-router-dom';
import { getSession, clearSession } from '@/lib/agriAuth';

// portal: 'farmer' | 'admin'. Redirects to /signin when no session,
// and blocks cross-portal access.
export default function ProtectedRoute({ portal }) {
  const session = getSession();
  if (!session || session.portal !== portal) {
    clearSession();
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}