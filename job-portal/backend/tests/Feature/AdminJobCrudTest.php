<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminJobCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $regularUser;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        $this->regularUser = User::factory()->user()->create();
        $this->category = Category::create(['name' => 'React', 'slug' => 'react']);
    }

    private function validJobPayload(): array
    {
        return [
            'title' => 'Senior React Developer',
            'category_id' => $this->category->id,
            'description' => 'Build amazing interfaces.',
            'location' => 'Bangalore',
            'employment_type' => 'full_time',
            'experience_level' => 'senior',
            'salary_min' => 900000,
            'salary_max' => 1600000,
            'company_name' => 'TechGiant',
            'application_deadline' => now()->addMonths(2)->toDateString(),
            'status' => 'published',
        ];
    }

    public function test_admin_can_list_created_jobs(): void
    {
        Job::factory()->create(['created_by' => $this->admin->id]);

        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/jobs')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_job(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/jobs', $this->validJobPayload());

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Job created successfully')
            ->assertJsonPath('data.title', 'Senior React Developer')
            ->assertJsonStructure(['data' => ['slug', 'id']]);

        $this->assertDatabaseHas('jobs', ['title' => 'Senior React Developer']);
    }

    public function test_job_validation_fails_with_invalid_data(): void
    {
        $payload = $this->validJobPayload();
        $payload['salary_max'] = 100;
        $payload['salary_min'] = 500;
        $payload['employment_type'] = 'invalid_type';
        $payload['application_deadline'] = 'not-a-date';
        $payload['category_id'] = 999;

        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/jobs', $payload)
            ->assertStatus(422);
    }

    public function test_admin_can_update_job(): void
    {
        $job = Job::factory()->create(['created_by' => $this->admin->id]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/jobs/{$job->id}", [
                'title' => 'Updated Title',
                'category_id' => $this->category->id,
                'description' => 'Updated description.',
                'location' => 'Kochi',
                'employment_type' => 'remote',
                'experience_level' => 'lead',
                'company_name' => 'NewCompany',
                'application_deadline' => now()->addMonths(1)->toDateString(),
                'status' => 'draft',
            ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Job updated successfully')
            ->assertJsonPath('data.title', 'Updated Title');

        $this->assertDatabaseHas('jobs', ['id' => $job->id, 'title' => 'Updated Title']);
    }

    public function test_admin_can_soft_delete_job(): void
    {
        $job = Job::factory()->create(['created_by' => $this->admin->id]);

        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/admin/jobs/{$job->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Job deleted successfully');

        $this->assertSoftDeleted('jobs', ['id' => $job->id]);

        $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/admin/jobs/{$job->id}")
            ->assertStatus(404);
    }

    public function test_regular_user_cannot_access_admin_jobs(): void
    {
        $this->actingAs($this->regularUser, 'sanctum')
            ->getJson('/api/admin/jobs')
            ->assertStatus(403);

        $this->actingAs($this->regularUser, 'sanctum')
            ->postJson('/api/admin/jobs', $this->validJobPayload())
            ->assertStatus(403);
    }

    public function test_unauthenticated_request_gets_401(): void
    {
        $this->getJson('/api/admin/jobs')->assertStatus(401);
        $this->postJson('/api/admin/jobs', $this->validJobPayload())->assertStatus(401);
    }

    public function test_admin_can_view_dashboard_stats(): void
    {
        Job::factory()->count(3)->create(['created_by' => $this->admin->id, 'status' => 'published']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.total_jobs', 3)
            ->assertJsonPath('data.published_jobs', 3)
            ->assertJsonStructure([
                'data' => [
                    'total_jobs', 'published_jobs', 'draft_jobs', 'closed_jobs',
                    'total_users', 'total_applications', 'pending_applications',
                    'shortlisted_applications', 'reviewed_applications', 'rejected_applications',
                ],
            ]);
    }
}