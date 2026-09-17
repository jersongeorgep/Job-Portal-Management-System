<?php

namespace App\Policies;

use App\Models\JobApplication;
use App\Models\User;

class ApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, JobApplication $application): bool
    {
        return $user->isAdmin() || $application->user_id === $user->id;
    }

    public function updateStatus(User $user, JobApplication $application): bool
    {
        return $user->isAdmin();
    }
}