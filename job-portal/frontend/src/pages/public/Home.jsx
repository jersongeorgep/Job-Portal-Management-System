import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedJobs, fetchPublicStats } from '../../features/jobs/jobSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import JobCard from '../../components/jobs/JobCard';
import { Search, Users, Building2, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const { featuredItems, stats } = useSelector((s) => s.jobs);
  const { items: categories } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchFeaturedJobs());
    dispatch(fetchCategories());
    dispatch(fetchPublicStats());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg lg:text-xl text-indigo-100 mb-8">
              Discover thousands of job opportunities from top companies. Your next career move starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/jobs"
                className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Search size={20} /> Browse Jobs
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div><Building2 className="h-10 w-10 text-indigo-600 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{stats?.total_companies ?? '—'}</p><p className="text-gray-500 text-sm">Companies</p></div>
            <div><TrendingUp className="h-10 w-10 text-indigo-600 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{stats?.total_jobs ?? '—'}</p><p className="text-gray-500 text-sm">Active Jobs</p></div>
            <div><Users className="h-10 w-10 text-indigo-600 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{stats?.total_users ?? '—'}</p><p className="text-gray-500 text-sm">Job Seekers</p></div>
            <div><Search className="h-10 w-10 text-indigo-600 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{stats?.total_categories ?? '—'}</p><p className="text-gray-500 text-sm">Categories</p></div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-500 mt-1">Hand-picked opportunities from top employers</p>
            </div>
            <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/jobs?category=${cat.id}`}
                  className="border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{cat.jobs_count} jobs</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Career?</h2>
          <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Create an account and start applying for jobs today. Your dream job is just a click away.</p>
          <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-block">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}