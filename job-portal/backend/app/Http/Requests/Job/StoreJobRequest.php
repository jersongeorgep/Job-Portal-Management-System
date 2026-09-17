<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'employment_type' => ['required', 'in:full_time,part_time,contract,internship,remote'],
            'experience_level' => ['required', 'in:entry,junior,mid,senior,lead'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'company_name' => ['required', 'string', 'max:255'],
            'application_deadline' => ['required', 'date', 'after:today'],
            'status' => ['required', 'in:draft,published,closed'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}