<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    public function __construct(protected Category $model) {}

    public function getAll()
    {
        return $this->model->withCount('jobs')->orderBy('name')->get();
    }

    public function findById(int $id): ?Category
    {
        return $this->model->find($id);
    }

    public function findBySlug(string $slug): ?Category
    {
        return $this->model->where('slug', $slug)->first();
    }
}