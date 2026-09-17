import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, IndianRupee, Calendar } from 'lucide-react';
import { formatSalary, formatDate, formatEmploymentType, formatExperienceLevel } from '../../utils/helpers';

export default function JobCard({ job, showActions = false, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <Link to={`/jobs/${job.slug}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{job.company_name}</p>
        </div>
        {job.category && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
            {job.category.name}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
        <span className="flex items-center gap-1.5"><Briefcase size={14} /> {formatEmploymentType(job.employment_type)}</span>
        <span className="flex items-center gap-1.5"><Clock size={14} /> {formatExperienceLevel(job.experience_level)}</span>
        <span className="flex items-center gap-1.5"><IndianRupee size={14} /> {formatSalary(job.salary?.min, job.salary?.max)}</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={12} /> Deadline: {formatDate(job.application_deadline)}
        </span>
        {showActions ? (
          <div className="flex gap-2">
            <button onClick={() => onEdit(job)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
            <button onClick={() => onDelete(job)} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
          </div>
        ) : (
          <Link to={`/jobs/${job.slug}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View Details →
          </Link>
        )}
      </div>
    </div>
  );
}