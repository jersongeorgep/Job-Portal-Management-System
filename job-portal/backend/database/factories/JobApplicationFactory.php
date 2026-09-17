<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobApplicationFactory extends Factory
{
    protected $model = \App\Models\JobApplication::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory(),
            'user_id' => User::factory(),
            'cover_letter' => fake()->paragraphs(2, true),
            'resume' => 'resumes/' . fake()->uuid() . '.pdf',
            'status' => 'pending',
            'applied_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}