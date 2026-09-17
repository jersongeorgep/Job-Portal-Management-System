import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, clearMessages } from '../../features/jobs/jobSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import JobForm from '../../components/jobs/JobForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successMessage } = useSelector((s) => s.jobs);
  const { items: categories } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) navigate('/admin/jobs');
  }, [successMessage, navigate]);

  const handleSubmit = (form, setErrors) => {
    dispatch(createJob(form)).then((res) => {
      if (res?.error) {
        setErrors(res.payload?.errors || {});
      }
    });
  };

  return (
    <div>
      <Link to="/admin/jobs" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={18} /> Back to Jobs
      </Link>
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Job</h1>
        <JobForm onSubmit={handleSubmit} loading={loading} categories={categories} />
      </div>
    </div>
  );
}