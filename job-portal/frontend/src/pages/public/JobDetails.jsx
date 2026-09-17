import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobBySlug } from '../../features/jobs/jobSlice';
import { applyForJob, clearMessages } from '../../features/applications/applicationSlice';
import { formatSalary, formatDate, formatEmploymentType, formatExperienceLevel } from '../../utils/helpers';
import { MapPin, Clock, Briefcase, IndianRupee, Calendar, Building2, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

export default function JobDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, loading } = useSelector((s) => s.jobs);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { loading: appLoading, successMessage, error: appError } = useSelector((s) => s.applications);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    dispatch(fetchJobBySlug(slug));
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch, slug]);

  const handleApply = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cover_letter', coverLetter);
    if (resume) formData.append('resume', resume);
    dispatch(applyForJob({ jobId: currentJob.id, formData })).then((res) => {
      if (!res.error) {
        setShowApplyForm(false);
        setCoverLetter('');
        setResume(null);
      }
    });
  };

  if (loading) return <Loader />;
  if (!currentJob) return <div className="text-center py-20 text-gray-500">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{currentJob.title}</h1>
            <p className="text-lg text-gray-500 mt-1 flex items-center gap-2"><Building2 size={18} /> {currentJob.company_name}</p>
          </div>
          {currentJob.category && (
            <span className="px-4 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">{currentJob.category.name}</span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={16} /> {currentJob.location}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><Briefcase size={16} /> {formatEmploymentType(currentJob.employment_type)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><Clock size={16} /> {formatExperienceLevel(currentJob.experience_level)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><IndianRupee size={16} /> {formatSalary(currentJob.salary?.min, currentJob.salary?.max)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-500"><Calendar size={14} /> Posted: {formatDate(currentJob.created_at)}</div>
          <div className="flex items-center gap-2 text-gray-500"><Calendar size={14} /> Deadline: {formatDate(currentJob.application_deadline)}</div>
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-lg font-semibold mb-3">Job Description</h3>
          <div className="text-gray-600 whitespace-pre-line">{currentJob.description}</div>
        </div>

        {/* Apply Section */}
        <div className="border-t pt-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{successMessage}</div>
          )}
          {appError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{appError}</div>
          )}

          {!isAuthenticated ? (
            <div className="text-center">
              <p className="text-gray-600 mb-3">You need to be logged in to apply for this job</p>
              <Button onClick={() => navigate('/login', { state: { from: { pathname: `/jobs/${slug}` } } })}>Login to Apply</Button>
            </div>
          ) : user?.role === 'admin' ? (
            <p className="text-gray-500 text-center">Admin accounts cannot apply for jobs</p>
          ) : showApplyForm ? (
            <form onSubmit={handleApply} className="space-y-4 max-w-lg">
              <h3 className="text-lg font-semibold">Apply for this position</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us why you're a great fit..."
                />
              </div>
              <Input
                label="Resume (PDF/DOC/DOCX)"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" loading={appLoading}>Submit Application</Button>
                <Button variant="secondary" onClick={() => setShowApplyForm(false)} type="button">Cancel</Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setShowApplyForm(true)} size="lg">Apply Now</Button>
          )}
        </div>
      </div>
    </div>
  );
}