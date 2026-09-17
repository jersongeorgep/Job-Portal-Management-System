<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'description' => ['sometimes', 'string'],
            'location' => ['sometimes', 'string', 'max:255'],
            'employment_type' => ['sometimes', 'in:full_time,part_time,contract,internship,remote'],
            'experience_level' => ['sometimes', 'in:entry,junior,mid,senior,lead'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'company_name' => ['sometimes', 'string', 'max:255'],
            'application_deadline' => ['sometimes', 'date'],
            'status' => ['sometimes', 'in:draft,published,closed'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}