# Express.js TypeScript API

A production-ready Express.js API built with TypeScript, Prisma, and comprehensive security middleware.

## Features

- **TypeScript** - Type safety and better developer experience
- **Express.js** - Fast, unopinionated web framework
- **Prisma** - Modern database ORM
- **Security** - Helmet, CORS, rate limiting
- **Authentication** - JWT with bcrypt password hashing
- **Validation** - Zod schema validation
- **Logging** - Morgan (dev) and Pino (production)
- **Code Quality** - ESLint and Prettier

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Environment Variables

Create a `.env` file (already created):

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=3000
NODE_ENV=development
```

## Database Setup

The database has been initialized and migrated. To run future migrations:

```bash
npm run prisma:migrate
```

To open Prisma Studio (database GUI):

```bash
npm run prisma:studio
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## License

ISC
