<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateInsightsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add authentication logic if needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'idea' => 'required|string|min:10|max:1000',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'idea.required' => 'Please provide your idea.',
            'idea.string' => 'Your idea must be a valid text.',
            'idea.min' => 'Your idea should be at least 10 characters long.',
            'idea.max' => 'Your idea should not exceed 1000 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'idea' => 'idea description',
        ];
    }
}
