import { Briefcase } from 'lucide-react';

export default function EmptyState({ icon: Icon = Briefcase, title = 'No data found', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon className="h-12 w-12 text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-center text-sm">{description}</p>}
    </div>
  );
}