export const formatSalary = (min, max) => {
  const format = (n) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n?.toString() || '0';
  };
  if (min && max) return `₹${format(min)} - ₹${format(max)}`;
  if (min) return `₹${format(min)}+`;
  if (max) return `Up to ₹${format(max)}`;
  return 'Not specified';
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export const formatEmploymentType = (type) => {
  return type?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || '';
};

export const formatExperienceLevel = (level) => {
  return level?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || '';
};