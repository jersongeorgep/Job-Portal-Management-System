import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../features/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/jobs');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    const result = await dispatch(register(form));
    if (result?.error) {
      const errors = result.payload?.errors;
      if (errors) setValidationErrors(errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-gray-900">JobPortal</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create an account</h1>
          <p className="text-gray-500 mt-1">Start your job search today</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={validationErrors.name?.[0]} required placeholder="John Doe" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={validationErrors.email?.[0]} required placeholder="you@example.com" />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={validationErrors.password?.[0]} required placeholder="Min 6 characters" />
            <Input label="Confirm Password" type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}