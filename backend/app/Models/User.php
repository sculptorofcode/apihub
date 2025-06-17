<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Exception;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class User extends Authenticatable implements CanResetPasswordContract, MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar',
        'banner',
        'bio',
        'location',
        'website',
        'phone',
        'last_active_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(): void
    {
        try {
            // Generate verification URL with signature
            $verifyUrl = URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(60),
                [
                    'id' => $this->getKey(),
                    'hash' => sha1($this->getEmailForVerification()),
                ]
            );

            $parsedUrl = parse_url($verifyUrl);
            parse_str($parsedUrl['query'] ?? '', $queryParams);
            
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $verificationLink = sprintf(
                "%s/auth/verify-email?id=%s&hash=%s&expires=%s&signature=%s",
                $frontendUrl,
                $this->getKey(),
                urlencode(sha1($this->getEmailForVerification())),
                $queryParams['expires'] ?? '',
                $queryParams['signature'] ?? ''
            );

            // Send email with verification link
            Mail::send('emails.verify-email', [
                'verificationUrl' => $verificationLink,
                'user' => $this
            ], function ($message) {
                $message->to($this->email);
                $message->subject('Verify Email Address');
            });

            Log::info('Email verification notification sent successfully', [
                'user_id' => $this->id,
                'email' => $this->email,
            ]);
        } catch (Exception $e) {
            Log::error('Failed to send email verification notification', [
                'user_id' => $this->id,
                'email' => $this->email,
                'error' => $e->getMessage(),
            ]);
        }
    }
    
    /**
     * Get the sent friend requests of the user.
     */
    public function sentFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    /**
     * Get the received friend requests of the user.
     */
    public function receivedFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    /**
     * Get the friendships where this user is the owner.
     */
    public function friendships()
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }

    /**
     * Get the friendships where this user is the friend.
     */
    public function friendsOf()
    {
        return $this->hasMany(Friendship::class, 'friend_id');
    }

    /**
     * Get the friends of this user.
     * Friends relationship is established through the friendships table.
     */
    public function friends()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'user_id',
            'friend_id'
        )->withTimestamps();
    }

    /**
     * Get the posts created by the user.
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the comments created by the user.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the posts liked by the user.
     */
    public function likedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_likes', 'user_id', 'post_id')->withTimestamps();
    }

    /**
     * Get the posts bookmarked by the user.
     */
    public function bookmarkedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_bookmarks', 'user_id', 'post_id')->withTimestamps();
    }

    /**
     * Get the comments liked by the user.
     */
    public function likedComments()
    {
        return $this->belongsToMany(Comment::class, 'comment_likes', 'user_id', 'comment_id')->withTimestamps();
    }
}
