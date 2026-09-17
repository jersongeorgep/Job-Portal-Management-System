<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(['email' => 'admin@example.com'], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $user1 = User::updateOrCreate(['email' => 'user@example.com'], [
            'name' => 'John Doe',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $user2 = User::updateOrCreate(['email' => 'jane@example.com'], [
            'name' => 'Jane Smith',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $user3 = User::updateOrCreate(['email' => 'mike@example.com'], [
            'name' => 'Mike Johnson',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $categories = [
            ['name' => 'PHP', 'slug' => 'php'],
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'JavaScript', 'slug' => 'javascript'],
            ['name' => 'Python', 'slug' => 'python'],
            ['name' => 'Java', 'slug' => 'java'],
            ['name' => 'UI/UX', 'slug' => 'ui-ux'],
            ['name' => 'DevOps', 'slug' => 'devops'],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[] = Category::updateOrCreate(['slug' => $cat['slug']], ['name' => $cat['name']]);
        }

        $jobTitles = [
            ['title' => 'Senior Laravel Developer', 'location' => 'Kochi', 'experience_level' => 'senior', 'employment_type' => 'full_time', 'company_name' => 'TechCorp India', 'salary_min' => 800000, 'salary_max' => 1500000],
            ['title' => 'Junior React Developer', 'location' => 'Bangalore', 'experience_level' => 'junior', 'employment_type' => 'full_time', 'company_name' => 'WebSolutions', 'salary_min' => 400000, 'salary_max' => 700000],
            ['title' => 'Full Stack Developer', 'location' => 'Remote', 'experience_level' => 'mid', 'employment_type' => 'remote', 'company_name' => 'GlobalTech', 'salary_min' => 600000, 'salary_max' => 1200000],
            ['title' => 'Python Data Engineer', 'location' => 'Chennai', 'experience_level' => 'mid', 'employment_type' => 'full_time', 'company_name' => 'DataFlow Inc', 'salary_min' => 700000, 'salary_max' => 1300000],
            ['title' => 'UI/UX Designer', 'location' => 'Mumbai', 'experience_level' => 'mid', 'employment_type' => 'full_time', 'company_name' => 'DesignHub', 'salary_min' => 500000, 'salary_max' => 900000],
            ['title' => 'DevOps Engineer', 'location' => 'Pune', 'experience_level' => 'senior', 'employment_type' => 'full_time', 'company_name' => 'CloudFirst', 'salary_min' => 900000, 'salary_max' => 1600000],
            ['title' => 'Entry Level PHP Developer', 'location' => 'Kochi', 'experience_level' => 'entry', 'employment_type' => 'full_time', 'company_name' => 'StartUp Labs', 'salary_min' => 250000, 'salary_max' => 450000],
            ['title' => 'JavaScript Frontend Developer', 'location' => 'Bangalore', 'experience_level' => 'mid', 'employment_type' => 'full_time', 'company_name' => 'Pixel Perfect', 'salary_min' => 550000, 'salary_max' => 1000000],
            ['title' => 'Java Backend Developer', 'location' => 'Hyderabad', 'experience_level' => 'senior', 'employment_type' => 'full_time', 'company_name' => 'Enterprise Solutions', 'salary_min' => 850000, 'salary_max' => 1400000],
            ['title' => 'React Native Mobile Developer', 'location' => 'Remote', 'experience_level' => 'mid', 'employment_type' => 'remote', 'company_name' => 'AppWorks', 'salary_min' => 600000, 'salary_max' => 1100000],
            ['title' => 'Laravel REST API Developer', 'location' => 'Trivandrum', 'experience_level' => 'junior', 'employment_type' => 'contract', 'company_name' => 'API Masters', 'salary_min' => 400000, 'salary_max' => 750000],
            ['title' => 'Senior React Engineer', 'location' => 'Bangalore', 'experience_level' => 'lead', 'employment_type' => 'full_time', 'company_name' => 'TechGiant', 'salary_min' => 1200000, 'salary_max' => 2200000],
            ['title' => 'Python Django Developer', 'location' => 'Chennai', 'experience_level' => 'junior', 'employment_type' => 'full_time', 'company_name' => 'PyWorks', 'salary_min' => 350000, 'salary_max' => 650000],
            ['title' => 'Junior UI Designer', 'location' => 'Mumbai', 'experience_level' => 'entry', 'employment_type' => 'internship', 'company_name' => 'Creative Studios', 'salary_min' => 150000, 'salary_max' => 300000],
            ['title' => 'Senior DevOps Lead', 'location' => 'Remote', 'experience_level' => 'lead', 'employment_type' => 'remote', 'company_name' => 'InfraPro', 'salary_min' => 1500000, 'salary_max' => 2500000],
            ['title' => 'Mid Level Laravel Developer', 'location' => 'Kochi', 'experience_level' => 'mid', 'employment_type' => 'full_time', 'company_name' => 'PHP Experts', 'salary_min' => 550000, 'salary_max' => 950000],
            ['title' => 'React Frontend Intern', 'location' => 'Bangalore', 'experience_level' => 'entry', 'employment_type' => 'internship', 'company_name' => 'CodeCamp', 'salary_min' => 100000, 'salary_max' => 200000],
            ['title' => 'Java Full Stack Developer', 'location' => 'Delhi', 'experience_level' => 'senior', 'employment_type' => 'full_time', 'company_name' => 'SystemCore', 'salary_min' => 900000, 'salary_max' => 1700000],
            ['title' => 'DevOps Contract Engineer', 'location' => 'Pune', 'experience_level' => 'mid', 'employment_type' => 'contract', 'company_name' => 'CloudNine', 'salary_min' => 700000, 'salary_max' => 1200000],
            ['title' => 'Laravel Lead Developer', 'location' => 'Remote', 'experience_level' => 'lead', 'employment_type' => 'remote', 'company_name' => 'RemoteFirst Inc', 'salary_min' => 1300000, 'salary_max' => 2100000],
            ['title' => 'Python AI/ML Engineer', 'location' => 'Bangalore', 'experience_level' => 'senior', 'employment_type' => 'full_time', 'company_name' => 'AI Labs', 'salary_min' => 1000000, 'salary_max' => 1800000],
            ['title' => 'React TypeScript Developer', 'location' => 'Kochi', 'experience_level' => 'mid', 'employment_type' => 'full_time', 'company_name' => 'TypeSafe Solutions', 'salary_min' => 600000, 'salary_max' => 1100000],
            ['title' => 'Junior JavaScript Developer', 'location' => 'Hyderabad', 'experience_level' => 'junior', 'employment_type' => 'part_time', 'company_name' => 'FlexiCode', 'salary_min' => 200000, 'salary_max' => 400000],
            ['title' => 'Senior PHP Architect', 'location' => 'Mumbai', 'experience_level' => 'lead', 'employment_type' => 'full_time', 'company_name' => 'ArchitectTech', 'salary_min' => 1400000, 'salary_max' => 2400000],
            ['title' => 'UI/UX Research Specialist', 'location' => 'Delhi', 'experience_level' => 'senior', 'employment_type' => 'full_time', 'company_name' => 'UserFirst Design', 'salary_min' => 800000, 'salary_max' => 1500000],
        ];

        $statuses = ['draft', 'published', 'closed'];
        $users = [$admin, $user1, $user2, $user3];

        $jobs = [];
        foreach ($jobTitles as $index => $jobData) {
            $categoryIndex = $index % count($createdCategories);
            $status = $index < 18 ? 'published' : $statuses[$index % 3];
            $isFeatured = $index < 6;
            $slug = Str::slug($jobData['title']);

            $jobs[] = Job::updateOrCreate(['slug' => $slug], [
                'category_id' => $createdCategories[$categoryIndex]->id,
                'title' => $jobData['title'],
                'description' => $this->generateDescription($jobData['title']),
                'location' => $jobData['location'],
                'employment_type' => $jobData['employment_type'],
                'experience_level' => $jobData['experience_level'],
                'salary_min' => $jobData['salary_min'],
                'salary_max' => $jobData['salary_max'],
                'company_name' => $jobData['company_name'],
                'application_deadline' => now()->addMonths(rand(1, 6)),
                'status' => $status,
                'is_featured' => $isFeatured,
                'created_by' => $admin->id,
            ]);
        }

        $applications = [
            ['job' => 0, 'user' => 1, 'status' => 'pending'],
            ['job' => 0, 'user' => 2, 'status' => 'reviewed'],
            ['job' => 1, 'user' => 1, 'status' => 'shortlisted'],
            ['job' => 2, 'user' => 3, 'status' => 'pending'],
            ['job' => 2, 'user' => 1, 'status' => 'rejected'],
            ['job' => 3, 'user' => 2, 'status' => 'pending'],
            ['job' => 4, 'user' => 1, 'status' => 'shortlisted'],
            ['job' => 5, 'user' => 3, 'status' => 'reviewed'],
            ['job' => 6, 'user' => 1, 'status' => 'pending'],
            ['job' => 7, 'user' => 2, 'status' => 'pending'],
            ['job' => 10, 'user' => 1, 'status' => 'shortlisted'],
            ['job' => 11, 'user' => 3, 'status' => 'pending'],
        ];

        foreach ($applications as $app) {
            if (isset($jobs[$app['job']])) {
                $job = $jobs[$app['job']];
                $user = $users[$app['user']];

                if (JobApplication::where('job_id', $job->id)->where('user_id', $user->id)->exists()) {
                    continue;
                }

                JobApplication::create([
                    'job_id' => $job->id,
                    'user_id' => $user->id,
                    'cover_letter' => 'I am writing to express my interest in this position. With my skills and experience, I believe I would be a great fit for this role.',
                    'resume' => 'resumes/' . Str::random(20) . '.pdf',
                    'status' => $app['status'],
                    'applied_at' => fake()->dateTimeBetween('-2 weeks', 'now'),
                ]);
            }
        }
    }

    protected function generateDescription(string $title): string
    {
        return <<<EOT
## About the Role

We are looking for a talented **{$title}** to join our team. This is an exciting opportunity to work on challenging projects and grow your career.

## Responsibilities

- Design and develop high-quality software solutions
- Collaborate with cross-functional teams
- Write clean, maintainable, and well-documented code
- Participate in code reviews and provide constructive feedback
- Troubleshoot and debug applications
- Stay up-to-date with emerging technologies

## Requirements

- Strong problem-solving skills
- Excellent communication and teamwork abilities
- Experience with modern development practices
- Ability to work in a fast-paced environment
- Passion for learning new technologies

## Benefits

- Competitive salary and benefits
- Flexible working arrangements
- Professional development opportunities
- Collaborative and inclusive work environment
- Health insurance and wellness programs

We look forward to hearing from you!
EOT;
    }
}