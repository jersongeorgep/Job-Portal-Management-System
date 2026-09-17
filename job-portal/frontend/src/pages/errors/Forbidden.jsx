import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';

export default function Forbidden() {
  return (
    <PublicLayout>
      <div className="text-center py-24 px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-gray-500 mb-6">You do not have permission to access this page.</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">Go Home</Link>
      </div>
    </PublicLayout>
  );
}