# Tezpur University Events Management

A full-stack web application for managing university events, built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- User authentication (Admin/Student) with JWT
- Event creation, enrollment, and management
- Real-time live scores with Socket.IO
- Admin dashboard with full CRUD operations
- Pending approval system for users and events
- Responsive, premium UI design

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Socket.IO

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start dev server
npm run dev
```

### Frontend Setup

```bash
# From root directory
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Default Admin Login

Email: `admin@tezu.ac.in`
Password: `admin123`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `GET /api/auth/users` - List all users (Admin)
- `DELETE /api/auth/users/:id` - Delete user (Admin)
- `PUT /api/auth/users/:id/approval` - Update user approval (Admin)

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event (Admin)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)
- `POST /api/events/:id/enroll` - Enroll student
- `POST /api/events/:id/unenroll` - Unenroll student
- `GET /api/events/:id/students` - Get enrolled students
- `PUT /api/events/:id/approve` - Approve event (Admin)
- `PUT /api/events/:id/reject` - Reject event (Admin)

### Live Scores
- `GET /api/livescores` - List all scores
- `POST /api/livescores` - Create score entry (Admin)
- `GET /api/livescores/event/:eventId` - Get score by event
- `PUT /api/livescores/:id` - Update score (Admin)
- `DELETE /api/livescores/:id` - Delete score (Admin)

## Project Structure

```
tezpur-university-events/
├── backend/           # Backend API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
├── src/              # Frontend
│   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── styles/
│   └── main.tsx
├── package.json
├── tailwind.config.js
└── README.md
```
