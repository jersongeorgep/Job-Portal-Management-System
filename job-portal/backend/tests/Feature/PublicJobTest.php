<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicJobTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        $this->category = Category::create(['name' => 'Laravel', 'slug' => 'laravel']);
    }

    private function makeJob(array $overrides = []): Job
    {
        return Job::create(array_merge([
            'category_id' => $this->category->id,
            'title' => 'Senior Laravel Developer',
            'slug' => 'senior-laravel-developer',
            'description' => 'A great role.',
            'location' => 'Kochi',
            'employment_type' => 'full_time',
            'experience_level' => 'senior',
            'salary_min' => 800000,
            'salary_max' => 1500000,
            'company_name' => 'TechCorp',
            'application_deadline' => now()->addDays(30)->toDateString(),
            'status' => 'published',
            'is_featured' => false,
            'created_by' => $this->admin->id,
        ], $overrides));
    }

    public function test_public_job_listing_only_returns_published_jobs(): void
    {
        $this->makeJob();
        $this->makeJob(['title' => 'Hidden Draft', 'slug' => 'hidden-draft', 'status' => 'draft']);
        $this->makeJob(['title' => 'Hidden Closed', 'slug' => 'hidden-closed', 'status' => 'closed']);

        $response = $this->getJson('/api/jobs');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.title', 'Senior Laravel Developer');
    }

    public function test_public_job_listing_supports_search_filter(): void
    {
        $this->makeJob(['title' => 'React Engineer', 'slug' => 'react-engineer']);
        $this->makeJob(['title' => 'Laravel Engineer', 'slug' => 'laravel-engineer']);

        $this->getJson('/api/jobs?search=laravel')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Laravel Engineer');
    }

    public function test_multiple_filters_work_together(): void
    {
        $this->makeJob(['title' => 'Match Job', 'slug' => 'match-job', 'location' => 'Kochi', 'experience_level' => 'senior']);
        $this->makeJob(['title' => 'Wrong Location', 'slug' => 'wrong-location', 'location' => 'Mumbai', 'experience_level' => 'senior']);
        $this->makeJob(['title' => 'Wrong Level', 'slug' => 'wrong-level', 'location' => 'Kochi', 'experience_level' => 'junior']);

        $response = $this->getJson('/api/jobs?search=job&experience_level=senior&location=kochi&category='.$this->category->id);

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Match Job');
    }

    public function test_public_job_listing_is_paginated(): void
    {
        for ($i = 1; $i <= 15; $i++) {
            $this->makeJob(['title' => "Job {$i}", 'slug' => "job-{$i}"]);
        }

        $response = $this->getJson('/api/jobs?per_page=5&page=2');

        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.total', 15)
            ->assertJsonPath('meta.last_page', 3);
    }

    public function test_featured_jobs_only_returns_featured_published(): void
    {
        $this->makeJob(['is_featured' => true, 'title' => 'Featured A', 'slug' => 'featured-a']);
        $this->makeJob(['is_featured' => true, 'title' => 'Featured B', 'slug' => 'featured-b']);
        $this->makeJob(['is_featured' => true, 'title' => 'Featured Draft', 'slug' => 'featured-draft', 'status' => 'draft']);

        $this->getJson('/api/jobs/featured')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_job_details_by_slug(): void
    {
        $job = $this->makeJob();

        $this->getJson("/api/jobs/{$job->slug}")
            ->assertOk()
            ->assertJsonPath('data.title', $job->title)
            ->assertJsonMissingPath('data.password')
            ->assertJsonStructure([
                'data' => [
                    'id', 'title', 'slug', 'company_name', 'category',
                    'location', 'employment_type', 'experience_level',
                    'salary' => ['min', 'max'], 'description', 'application_deadline', 'status',
                ],
            ]);
    }

    public function test_non_published_job_is_not_publicly_visible(): void
    {
        $job = $this->makeJob(['status' => 'closed', 'slug' => 'closed-job']);

        $this->getJson("/api/jobs/{$job->slug}")->assertStatus(404);
        $this->getJson('/api/jobs/non-existent-slug')->assertStatus(404);
    }

    public function test_categories_endpoint_returns_categories_with_counts(): void
    {
        $this->makeJob();

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Laravel');
    }

    public function test_stats_endpoint_returns_real_counts(): void
    {
        $this->makeJob();
        $this->makeJob(['title' => 'Draft Job', 'slug' => 'draft-job', 'status' => 'draft', 'company_name' => 'OtherCorp']);
        User::factory()->user()->create();

        $this->getJson('/api/stats')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_jobs', 1)
            ->assertJsonPath('data.total_companies', 1)
            ->assertJsonPath('data.total_categories', 1)
            ->assertJsonStructure(['data' => ['total_jobs', 'total_companies', 'total_categories', 'total_users']]);
    }
}