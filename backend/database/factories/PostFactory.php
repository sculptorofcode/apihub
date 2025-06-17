<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $visibilities = ['public', 'friends', 'private'];
        
        return [
            'user_id' => \App\Models\User::factory(),
            'content' => $this->faker->paragraph(rand(1, 5)),
            'image' => $this->faker->boolean(30) ? $this->faker->imageUrl(640, 480) : null,
            'video' => $this->faker->boolean(10) ? 'https://example.com/video.mp4' : null,
            'file' => null,
            'visibility' => $this->faker->randomElement($visibilities),
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'updated_at' => function (array $attributes) {
                return $attributes['created_at'];
            },
        ];
    }
}
