<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'company_name' => $this->company_name,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'location' => $this->location,
            'employment_type' => $this->employment_type,
            'experience_level' => $this->experience_level,
            'salary' => [
                'min' => $this->salary_min,
                'max' => $this->salary_max,
            ],
            'description' => $this->description,
            'application_deadline' => $this->application_deadline?->format('Y-m-d'),
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'created_by' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator->id,
                    'name' => $this->creator->name,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}