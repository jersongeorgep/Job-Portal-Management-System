import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../../features/applications/applicationSlice';
import ApplicationCard from '../../components/applications/ApplicationCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function UserApplications() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchUserApplications())} />
      ) : items.length === 0 ? (
        <EmptyState title="No applications yet" description="Start applying for jobs to see them here" />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
      <Pagination
        meta={pagination}
        onPageChange={(page) => dispatch(fetchUserApplications({ page }))}
      />
    </div>
  );
}