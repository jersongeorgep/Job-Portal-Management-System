import { Link } from 'react-router-dom';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import { ExternalLink } from 'lucide-react';

export default function ApplicationCard({ application, isAdmin = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{application.job?.title}</h3>
          <p className="text-sm text-gray-500">{application.job?.company_name}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
          {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
        </span>
      </div>
      {isAdmin && application.user && (
        <p className="text-sm text-gray-600 mb-2">Applicant: {application.user.name} ({application.user.email})</p>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Applied: {formatDateTime(application.applied_at)}</span>
        <Link
          to={isAdmin ? `/admin/applications/${application.id}` : `/applications/${application.id}`}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          View <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}