import { useEffect, useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, JOB_STATUSES } from '../../utils/constants';

export default function JobForm({ initialData, onSubmit, loading, categories }) {
  const [form, setForm] = useState({
    title: '', category_id: '', description: '', location: '',
    employment_type: 'full_time', experience_level: 'mid',
    salary_min: '', salary_max: '', company_name: '',
    application_deadline: '', status: 'draft', is_featured: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const categoryId = initialData.category?.id ?? initialData.category_id ?? '';
      const salaryMin = initialData.salary?.min ?? initialData.salary_min ?? '';
      const salaryMax = initialData.salary?.max ?? initialData.salary_max ?? '';
      // eslint-disable-next-line react/set-state-in-effect
      setForm({
        title: initialData.title || '',
        category_id: categoryId === '' ? '' : String(categoryId),
        description: initialData.description || '',
        location: initialData.location || '',
        employment_type: initialData.employment_type || 'full_time',
        experience_level: initialData.experience_level || 'mid',
        salary_min: salaryMin === '' ? '' : String(salaryMin),
        salary_max: salaryMax === '' ? '' : String(salaryMax),
        company_name: initialData.company_name || '',
        application_deadline: initialData.application_deadline || '',
        status: initialData.status || 'draft',
        is_featured: initialData.is_featured || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    onSubmit(form, setErrors);
  };

  const categoryOptions = categories?.map((c) => ({ value: String(c.id), label: c.name })) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Job Title" name="title" value={form.title} onChange={handleChange} error={errors.title} required placeholder="e.g. Senior Laravel Developer" />
        <Select label="Category" name="category_id" value={form.category_id} onChange={handleChange} options={categoryOptions} error={errors.category_id} placeholder="Select category" />
        <Input label="Company Name" name="company_name" value={form.company_name} onChange={handleChange} error={errors.company_name} required />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} required placeholder="e.g. Kochi" />
        <Select label="Employment Type" name="employment_type" value={form.employment_type} onChange={handleChange} options={EMPLOYMENT_TYPES} error={errors.employment_type} />
        <Select label="Experience Level" name="experience_level" value={form.experience_level} onChange={handleChange} options={EXPERIENCE_LEVELS} error={errors.experience_level} />
        <Input label="Min Salary (₹)" name="salary_min" type="number" value={form.salary_min} onChange={handleChange} error={errors.salary_min} placeholder="e.g. 500000" />
        <Input label="Max Salary (₹)" name="salary_max" type="number" value={form.salary_max} onChange={handleChange} error={errors.salary_max} placeholder="e.g. 1000000" />
        <Input label="Application Deadline" name="application_deadline" type="date" value={form.application_deadline} onChange={handleChange} error={errors.application_deadline} />
        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={JOB_STATUSES} error={errors.status} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description" value={form.description} onChange={handleChange} rows={6}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Job description..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="h-4 w-4 text-indigo-600 rounded" />
        <label className="text-sm font-medium text-gray-700">Mark as Featured</label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>{initialData ? 'Update Job' : 'Create Job'}</Button>
      </div>
    </form>
  );
}