import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye } from 'lucide-react';
import {
  formatDate,
  getStatusColor,
  formatEmploymentType,
  formatExperienceLevel,
} from '../../utils/helpers';

export default function JobTable({ jobs = [], onEdit, onDelete, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                <div className="text-xs text-gray-500">{job.company_name}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{job.category?.name || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{job.location}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatExperienceLevel(job.experience_level)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatEmploymentType(job.employment_type)}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(job.application_deadline)}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(job.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/jobs/${job.slug}`}
                    className="text-gray-500 hover:text-gray-700"
                    title="View"
                    onClick={() => onView?.(job)}
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit?.(job)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(job)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}