# F8 Clone Server

Base project using Express.js, TypeScript, Sequelize ORM, MySQL, and Zod validation.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe development
- **Sequelize ORM** - Database ORM for MySQL
- **MySQL** - Relational database
- **Zod** - Schema validation
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Prettier & ESLint** - Code formatting and linting

## 📁 Project Structure

```
src/
├── config/          # Database and other configurations
├── controllers/     # Request handlers
├── middleware/      # Custom middleware functions
├── models/          # Database models (Sequelize)
├── routes/          # API routes
├── schemas/         # Zod validation schemas
├── services/        # Business logic layer
└── types/           # TypeScript type definitions
```

## 🛠️ Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 2. Database Setup

Create a MySQL database and update the database credentials in `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=f8_clone_db
DB_USER=root
DB_PASSWORD=your_password
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📝 API Endpoints

### Health Check

- `GET /api/v1/health` - Check if API is running

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### User API Examples

#### Create User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get All Users

```bash
curl http://localhost:3000/api/v1/users
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier` - Check Prettier formatting
- `npm run prettier:fix` - Fix Prettier formatting

## 🏗️ Architecture

### Validation with Zod

All API endpoints use Zod schemas for request validation. Validation schemas are defined in `src/schemas/` and applied via middleware.

### Service Layer

Business logic is separated into service classes in `src/services/`. Controllers call services to handle operations.

### Error Handling

Centralized error handling middleware catches and formats errors consistently.

### Security

- Helmet for security headers
- CORS configuration
- Password hashing with bcryptjs
- Input validation with Zod

## 📄 Environment Variables

| Variable      | Description       | Default                 |
| ------------- | ----------------- | ----------------------- |
| `PORT`        | Server port       | `3000`                  |
| `NODE_ENV`    | Environment       | `development`           |
| `DB_HOST`     | Database host     | `localhost`             |
| `DB_PORT`     | Database port     | `3306`                  |
| `DB_NAME`     | Database name     | `f8_clone_db`           |
| `DB_USER`     | Database user     | `root`                  |
| `DB_PASSWORD` | Database password | -                       |
| `JWT_SECRET`  | JWT secret key    | -                       |
| `JWT_EXPIRE`  | JWT expiration    | `7d`                    |
| `CORS_ORIGIN` | CORS origin       | `http://localhost:3000` |
