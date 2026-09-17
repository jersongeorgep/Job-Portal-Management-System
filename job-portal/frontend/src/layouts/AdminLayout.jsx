import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Menu, X, Briefcase, LayoutDashboard, BriefcaseBusiness, FileText } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass}><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/jobs" className={linkClass}><BriefcaseBusiness size={18} /> Jobs</NavLink>
          <NavLink to="/admin/applications" className={linkClass}><FileText size={18} /> Applications</NavLink>
        </nav>
        <div className="p-4 border-t">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">← Back to Site</Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700">Logout</button>
          </div>
        </header>

        {sidebarOpen && (
          <div className="lg:hidden bg-white border-b p-4 space-y-1">
            <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setSidebarOpen(false)}>Dashboard</NavLink>
            <NavLink to="/admin/jobs" className={linkClass} onClick={() => setSidebarOpen(false)}>Jobs</NavLink>
            <NavLink to="/admin/applications" className={linkClass} onClick={() => setSidebarOpen(false)}>Applications</NavLink>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}