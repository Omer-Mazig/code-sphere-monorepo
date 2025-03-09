# Code Sphere

Code Sphere is a modern, full-stack social platform for developers to share code snippets, connect, and collaborate. This application provides a clean, intuitive interface for posting, commenting, and interacting with a community of developers.

## 🚀 Features

- User authentication and profile management via Clerk
- Social feed with code snippets and posts
- Commenting and interaction capabilities
- Responsive design optimized for all devices
- Real-time updates and notifications

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (TanStack Query)
- **API Integration**: Axios
- **Form Validation**: Zod
- **Build Tool**: Vite

### Backend

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Clerk SDK
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator and class-transformer
- **Environment**: Node.js (v18+)

## 📂 Project Structure

Code Sphere is organized as a monorepo with the following structure:

```
code-sphere/
├── client/            # Frontend React application
├── server/            # Backend NestJS application
└── shared/            # Shared code, types, and utilities
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/code-sphere.git
   cd code-sphere
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the variables with your own credentials

### Development

Run the entire application (both frontend and backend) with:

```bash
npm run dev
```

#### Frontend Only

```bash
npm run client
```

This will start the frontend application on [http://localhost:5173](http://localhost:5173).

#### Backend Only

```bash
npm run server
```

This will start the backend application on [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

This will create optimized builds for both client and server.

## 📚 API Documentation

Once the server is running, you can access the API documentation at:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🧪 Testing

```bash
# Run client tests
cd client && npm run test

# Run server tests
cd server && npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or issues, please open an issue in the repository or contact the project maintainers.
