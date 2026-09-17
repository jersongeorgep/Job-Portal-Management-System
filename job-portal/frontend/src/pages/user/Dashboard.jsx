import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../../features/applications/applicationSlice';
import ApplicationCard from '../../components/applications/ApplicationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchUserApplications({ per_page: 5 }));
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user?.name}</h1>
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
        <p className="text-gray-600">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No applications yet" description="Start applying for jobs to see them here" />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}