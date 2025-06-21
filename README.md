# APIHub - Modern Social Platform

<div align="center">
  <h3>Connect, Share, Engage</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Backend: Laravel](https://img.shields.io/badge/Backend-Laravel%2012-FF2D20?logo=laravel)](https://laravel.com)
  [![Frontend: React](https://img.shields.io/badge/Frontend-React%20+%20TypeScript-61DAFB?logo=react)](https://react.dev)
  [![UI: Shadcn/UI](https://img.shields.io/badge/UI-Shadcn-000000)](https://ui.shadcn.com/)
</div>

## 📋 Overview

APIHub is a feature-rich social platform built with modern technologies that enables users to connect, share content, and engage with each other in real-time. The platform consists of a Laravel backend API and a React TypeScript frontend, offering a seamless and responsive user experience.

## ✨ Features

- 👥 **User Authentication**: Secure login, registration, and profile management
- 📱 **Social Connections**: Friend requests, connections, and networking
- 📝 **Content Sharing**: Create, like, comment on, and share posts
- 💬 **Real-time Messaging**: Instant messaging between users
- 🔔 **Notifications**: Real-time notifications for interactions
- 📊 **Analytics**: Track engagement and activity
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This project follows a modern client-server architecture:

- **Backend**: Laravel 12 REST API with authentication, authorization, and real-time capabilities
- **Frontend**: React with TypeScript, Vite, and Shadcn UI components
- **Communication**: RESTful API + WebSockets for real-time features

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and npm/bun
- MySQL/PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sculptorofcode/apihub.git
   cd apihub
   ```

2. Set up the backend:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

4. Start the development servers:
   ```bash
   # In the backend directory
   php artisan serve

   # In the frontend directory
   npm run dev
   ```

5. Visit:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- API Documentation: http://localhost:8000/api/documentation (after running the backend)

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/sculptorofcode/apihub](https://github.com/sculptorofcode/apihub)

---

<div align="center">
  <sub>Built with ❤️ by 0_1_Binary</sub>
</div>
