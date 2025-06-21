# APIHub Backend

<div align="center">
  [![PHP Version](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php)](https://php.net)
  [![Laravel Version](https://img.shields.io/badge/Laravel-12.0-FF2D20?logo=laravel)](https://laravel.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

## 🌟 Overview

The APIHub backend is built with Laravel 12, providing a robust REST API for the social platform. It handles user authentication, content management, real-time messaging, notifications, and more.

## ✨ Features

- 🔐 **Authentication & Authorization**: Laravel Sanctum for secure API authentication
- 📦 **Eloquent ORM**: Powerful database interactions and relationships
- 📡 **Real-time Events**: Broadcasting events for real-time features
- 🔔 **Notifications**: System for managing user notifications
- 🧪 **Testing**: Comprehensive test suite using PHPUnit
- 📊 **API Resources**: Clean and consistent API responses
- 👥 **User Management**: Complete user profile and relationship handling

## 🛠️ Models & Relationships

The backend features several key models that power the social functionality:

- **User**: Core user account and profile data
- **Post**: User-created content that can be interacted with
- **Comment**: Responses to posts
- **Friendship**: Connections between users
- **FriendRequest**: Pending connection requests
- **Notification**: System and user notifications

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- MySQL/PostgreSQL database

### Installation

1. Clone the repository (if not done already):
   ```bash
   git clone https://github.com/sculptorofcode/apihub.git
   cd apihub/backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations and seed the database:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. Start the development server:
   ```bash
   php artisan serve
   ```

7. The API will be available at: http://localhost:8000/api

## 📝 API Documentation

### Available Endpoints

- **Authentication**
  - POST `/api/register` - Register a new user
  - POST `/api/login` - Login user
  - POST `/api/logout` - Logout user

- **Users**
  - GET `/api/users` - List users
  - GET `/api/users/{id}` - Get user details
  - PUT `/api/users/{id}` - Update user
  - GET `/api/users/{id}/posts` - Get user's posts

- **Posts**
  - GET `/api/posts` - List posts
  - POST `/api/posts` - Create post
  - GET `/api/posts/{id}` - Get post details
  - PUT `/api/posts/{id}` - Update post
  - DELETE `/api/posts/{id}` - Delete post
  - POST `/api/posts/{id}/like` - Like post
  - POST `/api/posts/{id}/comments` - Comment on post

- **Friendships**
  - GET `/api/friends` - List friends
  - POST `/api/friends/request/{id}` - Send friend request
  - POST `/api/friends/accept/{id}` - Accept friend request
  - POST `/api/friends/reject/{id}` - Reject friend request

- **Real-time Channels**
  - Various WebSocket channels for different real-time features

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
php artisan test
```

For specific tests:

```bash
php artisan test --filter=UserTest
```

## 📊 Database Migrations

The database structure is defined in migrations, ensuring data structure consistency across environments. To create a new migration:

```bash
php artisan make:migration create_new_table
```

## 🛡️ Security

Security features include:

- CSRF protection
- SQL injection prevention
- XSS protection
- Authentication with Sanctum
- Request rate limiting
- Input validation

## 📦 Deployment

Steps for deploying the backend to production:

1. Set up production environment
2. Configure `.env` for production
3. Run `composer install --optimize-autoloader --no-dev`
4. Cache routes and config: `php artisan config:cache && php artisan route:cache`
5. Set up appropriate web server configuration

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel API Tutorial](https://laravel.com/docs/10.x/sanctum)

---

<div align="center">
  <sub>Built with Laravel 12</sub>
</div>
