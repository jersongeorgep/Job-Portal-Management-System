import { Routes, Route, Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Home from '../pages/public/Home';
import Jobs from '../pages/public/Jobs';
import JobDetails from '../pages/public/JobDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Forbidden from '../pages/errors/Forbidden';

import UserDashboard from '../pages/user/Dashboard';
import UserApplications from '../pages/user/Applications';
import UserApplicationDetails from '../pages/user/ApplicationDetails';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminJobs from '../pages/admin/Jobs';
import CreateJob from '../pages/admin/CreateJob';
import EditJob from '../pages/admin/EditJob';
import AdminApplications from '../pages/admin/Applications';
import AdminApplicationDetails from '../pages/admin/ApplicationDetails';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/jobs" element={<PublicLayout><Jobs /></PublicLayout>} />
      <Route path="/jobs/:slug" element={<PublicLayout><JobDetails /></PublicLayout>} />
      <Route path="/403" element={<Forbidden />} />

      {/* User */}
      <Route path="/dashboard" element={
        <ProtectedRoute><UserLayout><UserDashboard /></UserLayout></ProtectedRoute>
      } />
      <Route path="/applications" element={
        <ProtectedRoute><UserLayout><UserApplications /></UserLayout></ProtectedRoute>
      } />
      <Route path="/applications/:id" element={
        <ProtectedRoute><UserLayout><UserApplicationDetails /></UserLayout></ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/jobs" element={
        <AdminRoute><AdminLayout><AdminJobs /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/jobs/create" element={
        <AdminRoute><AdminLayout><CreateJob /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/jobs/:id/edit" element={
        <AdminRoute><AdminLayout><EditJob /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/applications" element={
        <AdminRoute><AdminLayout><AdminApplications /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/applications/:id" element={
        <AdminRoute><AdminLayout><AdminApplicationDetails /></AdminLayout></AdminRoute>
      } />

      {/* 404 */}
      <Route path="*" element={
        <PublicLayout>
          <div className="text-center py-24">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-500 mb-4">Page not found</p>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">Go Home</Link>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}