import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminApplication, updateApplicationStatus, clearMessages } from '../../features/applications/applicationSlice';
import { formatDate, getStatusColor, formatSalary, formatEmploymentType, formatExperienceLevel } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { ArrowLeft, Download } from 'lucide-react';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function AdminApplicationDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentApplication, loading, error, successMessage } = useSelector((s) => s.applications);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(fetchAdminApplication(id));
    return () => dispatch(clearMessages());
  }, [dispatch, id]);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    if (currentApplication) setNewStatus(currentApplication.status);
  }, [currentApplication]);

  const handleUpdateStatus = () => {
    dispatch(updateApplicationStatus({ id, status: newStatus }));
  };

  if (loading || (!currentApplication && !error)) return <Loader />;
  if (!currentApplication) return <ErrorMessage message={error || 'Application not found'} />;

  const app = currentApplication;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/applications" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={18} /> Back to Applications
      </Link>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{app.job?.title}</h1>
            <p className="text-gray-500">{app.job?.company_name}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(app.status)}`}>
            {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Applicant Details</h3>
            <p className="text-sm text-gray-600"><strong>Name:</strong> {app.user?.name}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {app.user?.email}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Job Details</h3>
            <p className="text-sm text-gray-600"><strong>Location:</strong> {app.job?.location}</p>
            <p className="text-sm text-gray-600"><strong>Type:</strong> {formatEmploymentType(app.job?.employment_type)}</p>
            <p className="text-sm text-gray-600"><strong>Experience:</strong> {formatExperienceLevel(app.job?.experience_level)}</p>
            <p className="text-sm text-gray-600"><strong>Salary:</strong> {formatSalary(app.job?.salary?.min, app.job?.salary?.max)}</p>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Cover Letter</h3>
          <p className="text-gray-600 whitespace-pre-line text-sm bg-gray-50 p-4 rounded-lg">{app.cover_letter}</p>
        </div>

        <div className="border-t pt-4 mb-6">
          <h3 className="font-semibold mb-2">Resume</h3>
          {app.resume ? (
            <a href={app.resume_url} target="_blank" rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1">
              <Download size={14} /> Download Resume
            </a>
          ) : (
            <p className="text-gray-400 text-sm">No resume uploaded</p>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Update Status</h3>
          {successMessage && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{successMessage}</div>
          )}
          <div className="flex items-center gap-3">
            <Select
              options={APPLICATION_STATUSES}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-48 mb-0"
            />
            <Button onClick={handleUpdateStatus} loading={loading}>Update</Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Applied: {formatDate(app.applied_at)}</p>
        </div>
      </div>
    </div>
  );
}