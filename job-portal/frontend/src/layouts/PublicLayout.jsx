import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Menu, X, Briefcase } from 'lucide-react';

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">JobPortal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
              {isAuthenticated && user?.role === 'user' && (
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">{user?.name}</span>
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
                  <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Register
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-600">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t bg-white px-4 pb-4">
            <NavLink to="/jobs" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Jobs</NavLink>
            {isAuthenticated && user?.role === 'user' && (
              <NavLink to="/dashboard" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
            )}
            {isAuthenticated ? (
              <>
                <span className="block py-2 text-sm text-gray-500">{user?.name}</span>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-red-600 text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-indigo-600 font-medium" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2026 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}