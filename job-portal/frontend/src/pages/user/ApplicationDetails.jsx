import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplication, clearCurrentApplication } from '../../features/applications/applicationSlice';
import { formatDate, formatSalary, getStatusColor, formatEmploymentType, formatExperienceLevel } from '../../utils/helpers';
import { ArrowLeft, Download } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function UserApplicationDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentApplication, loading, error } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchUserApplication(id));
    return () => dispatch(clearCurrentApplication());
  }, [dispatch, id]);

  if (loading || (!currentApplication && !error)) return <Loader />;
  if (!currentApplication) return <ErrorMessage message={error || 'Application not found'} />;

  const app = currentApplication;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/applications" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={18} /> Back to Applications
      </Link>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{app.job?.title}</h1>
            <p className="text-gray-500">{app.job?.company_name}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(app.status)}`}>
            {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div><span className="text-gray-500">Location:</span> <span className="ml-1">{app.job?.location}</span></div>
          <div><span className="text-gray-500">Type:</span> <span className="ml-1">{formatEmploymentType(app.job?.employment_type)}</span></div>
          <div><span className="text-gray-500">Experience:</span> <span className="ml-1">{formatExperienceLevel(app.job?.experience_level)}</span></div>
          <div><span className="text-gray-500">Salary:</span> <span className="ml-1">{formatSalary(app.job?.salary?.min, app.job?.salary?.max)}</span></div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Cover Letter</h3>
          <p className="text-gray-600 whitespace-pre-line text-sm">{app.cover_letter}</p>
        </div>

        <div className="border-t pt-4 mb-4">
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

        <div className="border-t pt-4 text-sm text-gray-500">
          <p>Applied: {formatDate(app.applied_at)}</p>
        </div>
      </div>
    </div>
  );
}