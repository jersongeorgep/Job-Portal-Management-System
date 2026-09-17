import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminJobs, deleteJob, setFilters, clearMessages } from '../../features/jobs/jobSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import JobFilters from '../../components/jobs/JobFilters';
import JobTable from '../../components/jobs/JobTable';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';

export default function AdminJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, pagination, loading, error, successMessage, filters } = useSelector((s) => s.jobs);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminJobs(filters));
  }, [filters, dispatch]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    await dispatch(deleteJob(deleteModal.id));
    setDeleteModal(null);
    dispatch(fetchAdminJobs(filters));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
        <Link to="/admin/jobs/create">
          <Button><Plus size={16} className="mr-1" /> Create Job</Button>
        </Link>
      </div>

      <JobFilters />

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{successMessage}</div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchAdminJobs(filters))} />
      ) : items.length === 0 ? (
        <EmptyState title="No jobs found" description="Try adjusting your filters or create a new job." />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <JobTable
            jobs={items}
            onEdit={(job) => navigate(`/admin/jobs/${job.id}/edit`)}
            onDelete={(job) => setDeleteModal(job)}
          />
          <div className="px-4 py-3 border-t">
            <Pagination meta={pagination} onPageChange={(page) => dispatch(setFilters({ page }))} />
          </div>
        </div>
      )}

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Job" size="sm">
        <p className="text-gray-600 mb-4">Are you sure you want to delete "<strong>{deleteModal?.title}</strong>"?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}