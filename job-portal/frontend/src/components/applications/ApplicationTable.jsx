import { Link } from 'react-router-dom';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import { Eye } from 'lucide-react';

export default function ApplicationTable({ applications, showJob = true, showUser = true }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showJob && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>}
            {showUser && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              {showJob && (
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{app.job?.title}</div>
                  <div className="text-xs text-gray-500">{app.job?.company_name}</div>
                </td>
              )}
              {showUser && (
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{app.user?.name}</div>
                  <div className="text-xs text-gray-500">{app.user?.email}</div>
                </td>
              )}
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                  {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(app.applied_at)}</td>
              <td className="px-4 py-3">
                <Link to={`/admin/applications/${app.id}`} className="text-indigo-600 hover:text-indigo-800">
                  <Eye size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}