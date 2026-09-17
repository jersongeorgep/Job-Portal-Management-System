import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../features/jobs/jobSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { setFilters } from '../../features/jobs/jobSlice';
import { useSearchParams } from 'react-router-dom';

export default function Jobs() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error, filters } = useSelector((s) => s.jobs);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const urlFilters = {};
    for (const [key, value] of searchParams) {
      urlFilters[key] = value;
    }
    if (Object.keys(urlFilters).length) {
      dispatch(setFilters(urlFilters));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [filters, dispatch]);

  useEffect(() => {
    const next = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (key === 'page' && Number(value) === 1) return;
      next.set(key, String(value));
    });
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Jobs</h1>
      <p className="text-gray-500 mb-6">{pagination.total || 0} jobs found</p>
      <JobFilters />
      {loading ? (
        <Loader text="Loading jobs..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchJobs(filters))} />
      ) : items.length === 0 ? (
        <EmptyState title="No jobs found" description="Try adjusting your search filters" />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pagination meta={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}