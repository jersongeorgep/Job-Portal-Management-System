<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cover_letter' => ['required', 'string'],
            'resume' => ['required', 'file', 'max:5120', 'mimes:pdf,doc,docx'],
        ];
    }
}