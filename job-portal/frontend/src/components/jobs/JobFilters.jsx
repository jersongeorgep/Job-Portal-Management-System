import { useEffect, useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import Select from '../common/Select';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../features/jobs/jobSlice';

export default function JobFilters() {
  const dispatch = useDispatch();
  const { filters } = useSelector((s) => s.jobs);
  const { items: categories } = useSelector((s) => s.categories);

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [locationTerm, setLocationTerm] = useState(filters.location || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((filters.search || '') !== searchTerm) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((filters.location || '') !== locationTerm) {
        dispatch(setFilters({ location: locationTerm }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [locationTerm, filters.location, dispatch]);

  useEffect(() => {
    // Keep the input in sync when filters change externally (URL init, clear).
    // eslint-disable-next-line react/set-state-in-effect
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setLocationTerm(filters.location || '');
  }, [filters.location]);

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const hasFilters =
    filters.search ||
    filters.category ||
    filters.experience_level ||
    filters.employment_type ||
    filters.location;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative lg:w-48">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Location"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Select
          options={categoryOptions}
          placeholder="All Categories"
          value={filters.category}
          onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
          className="lg:w-48 mb-0"
        />
        <Select
          options={EXPERIENCE_LEVELS}
          placeholder="Experience"
          value={filters.experience_level}
          onChange={(e) => dispatch(setFilters({ experience_level: e.target.value }))}
          className="lg:w-44 mb-0"
        />
        <Select
          options={EMPLOYMENT_TYPES}
          placeholder="Type"
          value={filters.employment_type}
          onChange={(e) => dispatch(setFilters({ employment_type: e.target.value }))}
          className="lg:w-40 mb-0"
        />
        {hasFilters && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 px-3 py-2"
          >
            <X size={16} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}