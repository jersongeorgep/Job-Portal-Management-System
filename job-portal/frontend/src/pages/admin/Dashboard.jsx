import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Briefcase, FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;

  const cards = [
    { label: 'Total Jobs', value: stats?.total_jobs, icon: Briefcase, color: 'bg-indigo-500' },
    { label: 'Published', value: stats?.published_jobs, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Draft Jobs', value: stats?.draft_jobs, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Closed Jobs', value: stats?.closed_jobs, icon: XCircle, color: 'bg-red-500' },
    { label: 'Total Applications', value: stats?.total_applications, icon: FileText, color: 'bg-purple-500' },
    { label: 'Pending', value: stats?.pending_applications, icon: Clock, color: 'bg-orange-500' },
    { label: 'Shortlisted', value: stats?.shortlisted_applications, icon: TrendingUp, color: 'bg-teal-500' },
    { label: 'Reviewed', value: stats?.reviewed_applications, icon: CheckCircle, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <div className={`${card.color} p-2 rounded-lg`}>
                <card.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value || 0}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}