<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobFactory extends Factory
{
    protected $model = \App\Models\Job::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);
        return [
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->city(),
            'employment_type' => fake()->randomElement(['full_time', 'part_time', 'contract', 'internship', 'remote']),
            'experience_level' => fake()->randomElement(['entry', 'junior', 'mid', 'senior', 'lead']),
            'salary_min' => fake()->numberBetween(30000, 60000),
            'salary_max' => fn ($attr) => $attr['salary_min'] + fake()->numberBetween(20000, 80000),
            'company_name' => fake()->company(),
            'application_deadline' => fake()->dateTimeBetween('+1 month', '+6 months'),
            'status' => 'published',
            'is_featured' => fake()->boolean(20),
            'created_by' => User::factory(),
        ];
    }
}