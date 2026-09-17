import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Menu, X, Briefcase, LayoutDashboard, FileText } from 'lucide-react';

export default function UserLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900">JobPortal</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">Browse Jobs</Link>
            <span className="text-sm text-gray-500">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700">Logout</button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-600">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white px-4 pb-4">
            <Link to="/dashboard" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link to="/applications" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>My Applications</Link>
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-red-600 text-sm font-medium">Logout</button>
          </div>
        )}
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <aside className="hidden md:block w-56 shrink-0">
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={linkClass}><LayoutDashboard size={18} /> Dashboard</NavLink>
            <NavLink to="/applications" className={linkClass}><FileText size={18} /> My Applications</NavLink>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}