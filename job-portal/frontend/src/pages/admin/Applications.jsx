import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminApplications, clearMessages } from '../../features/applications/applicationSlice';
import ApplicationTable from '../../components/applications/ApplicationTable';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Select from '../../components/common/Select';
import ErrorMessage from '../../components/common/ErrorMessage';
import { APPLICATION_STATUSES } from '../../utils/constants';

export default function AdminApplications() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error, successMessage } = useSelector((s) => s.applications);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAdminApplications({ status: statusFilter }));
  }, [statusFilter, dispatch]);

  useEffect(() => {
    return () => dispatch(clearMessages());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <div className="w-48">
          <Select
            options={APPLICATION_STATUSES}
            placeholder="All Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{successMessage}</div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchAdminApplications({ status: statusFilter }))} />
      ) : items.length === 0 ? (
        <EmptyState title="No applications found" />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <ApplicationTable applications={items} />
          <div className="px-4 py-3 border-t">
            <Pagination
              meta={pagination}
              onPageChange={(page) => dispatch(fetchAdminApplications({ status: statusFilter, page }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}