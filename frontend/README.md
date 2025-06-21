# APIHub Frontend

<div align="center">
  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
  [![Shadcn/UI](https://img.shields.io/badge/UI-Shadcn-000000)](https://ui.shadcn.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

## 🌟 Overview

The APIHub frontend is a modern React application built with TypeScript, Vite, and Shadcn/UI components. It provides a rich user interface for the social platform, enabling users to connect with others, share content, and engage in real-time interactions.

## ✨ Features

- 🎨 **Modern UI**: Clean and responsive design using Shadcn UI components
- 🔐 **Authentication**: Complete user registration and login flows
- 📱 **Responsive Design**: Mobile-first approach for all device sizes
- 🌐 **State Management**: Efficient state management with context API
- 📝 **Social Features**: Posts, comments, likes, and shares
- 👥 **User Connections**: Friend requests and user networking
- 💬 **Messaging**: Real-time chat functionality
- 🎭 **Theming**: Light and dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

1. Clone the repository (if not done already):
   ```bash
   git clone https://github.com/sculptorofcode/apihub.git
   cd apihub/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with bun
   bun install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env file with your API URL and other settings
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or with bun
   bun dev
   ```

5. The application will be available at: http://localhost:5173

## 📁 Project Structure

```
frontend/
│
├── public/               # Static assets
├── src/
│   ├── api/              # API client and request functions
│   ├── components/       # Reusable UI components
│   │   ├── common/       # General purpose components
│   │   ├── forms/        # Form components
│   │   ├── layouts/      # Layout components
│   │   └── ui/           # Shadcn UI components
│   │
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   ├── services/         # Service layer for business logic
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │
│   ├── App.tsx           # Main application component
│   ├── config.ts         # App configuration
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
│
├── .eslintrc.js          # ESLint configuration
├── index.html            # HTML template
├── package.json          # Project dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🧩 Components

The frontend is built with reusable components:

- **Navigation**: Header, sidebar, and navigation menus
- **Posts**: Post cards, comment sections, and interactions
- **Forms**: Input components, validation, and submission handling
- **Modals**: Dialogs for various actions and confirmations
- **User**: Profile components, avatars, and status indicators

## 🎨 Styling

The application uses:

- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** for beautiful, accessible components
- **CSS Modules** for component-specific styles where needed
- **Theme variables** for consistent design system

## 🛠️ Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Lint code with ESLint

### Adding New Components

1. Create a new file in the appropriate directory under `src/components/`
2. Import necessary dependencies
3. Define your component using TypeScript
4. Export the component as default

Example:
```tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div className="p-4 border rounded">
      <h2>{title}</h2>
      <Button onClick={onClick}>Click Me</Button>
    </div>
  );
};

export default MyComponent;
```

## 📦 Deployment

To deploy the frontend:

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. The output will be in the `dist/` directory, which can be deployed to any static hosting service like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## 🧪 Testing

Run tests with:

```bash
npm run test
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)

---

<div align="center">
  <sub>Built with React + TypeScript + Vite</sub>
</div>
