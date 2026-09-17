<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $user;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->admin = User::factory()->admin()->create();
        $this->user = User::factory()->user()->create();
        $this->category = Category::create(['name' => 'PHP', 'slug' => 'php']);
    }

    private function publishedJob(array $overrides = []): Job
    {
        return Job::create(array_merge([
            'category_id' => $this->category->id,
            'title' => 'PHP Developer',
            'slug' => 'php-developer',
            'description' => 'A PHP role.',
            'location' => 'Kochi',
            'employment_type' => 'full_time',
            'experience_level' => 'mid',
            'salary_min' => 500000,
            'salary_max' => 900000,
            'company_name' => 'Codeworks',
            'application_deadline' => now()->addDays(30)->toDateString(),
            'status' => 'published',
            'created_by' => $this->admin->id,
        ], $overrides));
    }

    private function validApplicationPayload(): array
    {
        return [
            'cover_letter' => 'I believe my experience makes me a strong candidate.',
            'resume' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        ];
    }

    public function test_requires_authentication(): void
    {
        $job = $this->publishedJob();

        $this->postJson("/api/jobs/{$job->id}/apply", $this->validApplicationPayload())
            ->assertStatus(401);
    }

    public function test_admin_cannot_apply(): void
    {
        $job = $this->publishedJob();

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/jobs/{$job->id}/apply", $this->validApplicationPayload())
            ->assertStatus(403);
    }

    public function test_user_can_apply_with_resume(): void
    {
        $job = $this->publishedJob();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$job->id}/apply", $this->validApplicationPayload());

        $response->assertStatus(201)
            ->assertJsonPath('message', 'Application submitted successfully');

        $this->assertDatabaseHas('job_applications', [
            'job_id' => $job->id,
            'user_id' => $this->user->id,
        ]);

        $this->assertNotEmpty(Storage::disk('public')->files('resumes'));
    }

    public function test_applying_to_same_job_is_duplicate(): void
    {
        $job = $this->publishedJob();

        JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $this->user->id,
            'cover_letter' => 'Already applied.',
            'resume' => 'resumes/old.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$job->id}/apply", $this->validApplicationPayload())
            ->assertStatus(409)
            ->assertJsonPath('message', 'You have already applied for this job.');
    }

    public function test_applications_closed_after_deadline(): void
    {
        $job = $this->publishedJob([
            'application_deadline' => now()->subDay()->toDateString(),
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$job->id}/apply", $this->validApplicationPayload())
            ->assertStatus(422)
            ->assertJsonPath('message', 'Applications for this job are closed.');
    }

    public function test_cannot_apply_to_closed_or_draft_job(): void
    {
        $closed = $this->publishedJob(['title' => 'Closed Job', 'slug' => 'closed-job', 'status' => 'closed']);
        $draft = $this->publishedJob(['title' => 'Draft Job', 'slug' => 'draft-job', 'status' => 'draft']);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$closed->id}/apply", $this->validApplicationPayload())
            ->assertStatus(422);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$draft->id}/apply", $this->validApplicationPayload())
            ->assertStatus(422);
    }

    public function test_resume_validation_requires_pdf_doc_docx(): void
    {
        $job = $this->publishedJob();

        $payload = [
            'cover_letter' => 'Valid cover letter.',
            'resume' => UploadedFile::fake()->create('malware.exe', 100, 'application/x-msdownload'),
        ];

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$job->id}/apply", $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors('resume');
    }

    public function test_resume_and_cover_letter_are_required(): void
    {
        $job = $this->publishedJob();

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/jobs/{$job->id}/apply", ['cover_letter' => 'Only a letter'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('resume');
    }

    public function test_user_can_list_their_applications(): void
    {
        $job = $this->publishedJob();

        JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $this->user->id,
            'cover_letter' => 'My application.',
            'resume' => 'resumes/x.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/user/applications')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.job.title', $job->title);
    }

    public function test_user_cannot_view_another_users_application(): void
    {
        $job = $this->publishedJob();
        $other = User::factory()->user()->create();

        $app = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $other->id,
            'cover_letter' => 'Secret.',
            'resume' => 'resumes/x.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/user/applications/{$app->id}")
            ->assertStatus(404);
    }

    public function test_admin_can_list_applications_and_filter_by_status(): void
    {
        $job = $this->publishedJob();
        $userA = User::factory()->user()->create();

        JobApplication::create(['job_id' => $job->id, 'user_id' => $userA->id, 'cover_letter' => 'A', 'resume' => 'r', 'status' => 'pending', 'applied_at' => now()]);
        JobApplication::create(['job_id' => $job->id, 'user_id' => $this->user->id, 'cover_letter' => 'B', 'resume' => 'r', 'status' => 'shortlisted', 'applied_at' => now()]);

        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/applications?status=pending')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'pending');
    }

    public function test_admin_can_see_application_details(): void
    {
        $job = $this->publishedJob();

        $app = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $this->user->id,
            'cover_letter' => 'Cover here.',
            'resume' => 'resumes/x.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/admin/applications/{$app->id}")
            ->assertOk()
            ->assertJsonPath('data.cover_letter', 'Cover here.')
            ->assertJsonPath('data.user.email', $this->user->email)
            ->assertJsonPath('data.job.title', $job->title);
    }

    public function test_admin_can_update_application_status(): void
    {
        $job = $this->publishedJob();

        $app = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $this->user->id,
            'cover_letter' => 'Cover here.',
            'resume' => 'resumes/x.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$app->id}/status", ['status' => 'shortlisted'])
            ->assertOk()
            ->assertJsonPath('message', 'Application status updated successfully')
            ->assertJsonPath('data.status', 'shortlisted')
            ->assertJsonPath('data.job.id', $job->id)
            ->assertJsonPath('data.user.id', $this->user->id)
            ->assertJsonStructure(['data' => ['id', 'status', 'job' => ['id', 'title'], 'user' => ['id', 'name', 'email']]]);

        $this->assertDatabaseHas('job_applications', ['id' => $app->id, 'status' => 'shortlisted']);
    }

    public function test_admin_cannot_update_to_invalid_status(): void
    {
        $job = $this->publishedJob();

        $app = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $this->user->id,
            'cover_letter' => 'Cover.',
            'resume' => 'resumes/x.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$app->id}/status", ['status' => 'bogus'])
            ->assertStatus(422);
    }

    public function test_regular_user_cannot_update_application_status(): void
    {
        $job = $this->publishedJob();

        $app = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $this->user->id,
            'cover_letter' => 'Cover.',
            'resume' => 'resumes/x.pdf',
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->patchJson("/api/admin/applications/{$app->id}/status", ['status' => 'reviewed'])
            ->assertStatus(403);
    }
}